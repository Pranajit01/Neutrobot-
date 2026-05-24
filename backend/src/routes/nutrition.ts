import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { db } from '../prisma';
import { redisClient } from '../redis';
import Anthropic from '@anthropic-ai/sdk';

const router = Router();

// Retrieve key or dummy fallback
const apiKey = process.env.ANTHROPIC_API_KEY;
let anthropic: Anthropic | null = null;
if (apiKey && apiKey !== 'dummy_key_to_prevent_crash') {
  anthropic = new Anthropic({ apiKey });
}

// Local mock nutrition analysis parser for offline/no-key fallback
function analyzeMealLocally(query: string) {
  const q = query.toLowerCase();
  
  let calories = 350;
  let protein = 12;
  let carbs = 35;
  let fat = 10;
  let fiber = 2;

  // Keyword check
  if (q.includes('chicken') || q.includes('poultry')) {
    calories += 220;
    protein += 30;
    fat += 4;
  }
  if (q.includes('egg')) {
    calories += 140;
    protein += 12;
    fat += 9;
  }
  if (q.includes('pizza')) {
    calories += 650;
    carbs += 75;
    protein += 20;
    fat += 25;
  }
  if (q.includes('salad') || q.includes('greens') || q.includes('vegetable')) {
    calories += 100;
    carbs += 12;
    fiber += 5;
    protein += 2;
  }
  if (q.includes('quinoa') || q.includes('rice') || q.includes('grain')) {
    calories += 200;
    carbs += 40;
    fiber += 4;
    protein += 5;
  }
  if (q.includes('bread') || q.includes('toast')) {
    calories += 120;
    carbs += 25;
    fiber += 2;
  }
  if (q.includes('shake') || q.includes('protein powder') || q.includes('whey')) {
    calories += 180;
    protein += 25;
    carbs += 5;
  }
  if (q.includes('avocado') || q.includes('olive oil') || q.includes('nuts')) {
    calories += 180;
    fat += 15;
  }

  const deficiencies: string[] = [];
  const recommendations: string[] = [];

  if (protein < 20) {
    deficiencies.push('Low Protein Intake');
    recommendations.push('Add a lean meat, eggs, or plant-based protein source.');
  }
  if (fiber < 4) {
    deficiencies.push('Fiber Deficient');
    recommendations.push('Incorporate 200g of leafy greens, broccoli, or chia seeds.');
  }
  if (!q.includes('fish') && !q.includes('salmon') && !q.includes('egg')) {
    deficiencies.push('Vitamin D');
    recommendations.push('Consider a walk outside or vitamin-D fortified foods.');
  }
  if (calories > 900) {
    recommendations.push('This is a calorie-dense meal. Watch your portion sizes.');
  } else {
    recommendations.push('Balanced caloric intake. Maintain steady hydration.');
  }

  return {
    calories,
    protein,
    carbs,
    fat,
    fiber,
    deficiencies,
    recommendations
  };
}

function sanitizeNumber(val: any, fallback: number = 0): number {
  if (val === null || val === undefined) return fallback;
  if (typeof val === 'number') {
    return isNaN(val) ? fallback : val;
  }
  if (typeof val === 'string') {
    const cleanStr = val.replace(/[a-zA-Z\s]+/g, '');
    const num = parseFloat(cleanStr);
    return isNaN(num) ? fallback : num;
  }
  return fallback;
}

function sanitizeStringArray(arr: any): string[] {
  if (!Array.isArray(arr)) {
    if (typeof arr === 'string' && arr.trim()) {
      return [arr.trim()];
    }
    return [];
  }
  return arr.map(item => String(item).trim()).filter(Boolean);
}

router.post('/analyze', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    let jsonResponse;
    let fallbackUsed = false;

    if (anthropic) {
      try {
        const systemPrompt = `You are a professional nutrition analyzer. Analyze the following food log query and return ONLY a structured JSON object containing nutritional data. Do not include any markdown formatting, explanation, or conversational text. Return exactly this JSON structure:
{
  "calories": number,
  "protein": number, // in grams
  "carbs": number, // in grams
  "fat": number, // in grams
  "fiber": number, // in grams
  "deficiencies": string[], // Any likely nutritional deficiencies from this meal
  "recommendations": string[] // Recommendations for a more balanced diet based on this meal
}`;

        const message = await anthropic.messages.create({
          model: 'claude-3-haiku-20240307',
          max_tokens: 1000,
          temperature: 0,
          system: systemPrompt,
          messages: [{ role: 'user', content: query }],
        });

        const content = message.content[0].type === 'text' ? message.content[0].text : '';
        // Clean markdown backticks if returned by the LLM
        const cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
        jsonResponse = JSON.parse(cleanContent);
      } catch (err) {
        console.warn('External API request failed, using local parser fallback:', err);
        fallbackUsed = true;
      }
    } else {
      fallbackUsed = true;
    }

    if (fallbackUsed || !jsonResponse) {
      jsonResponse = analyzeMealLocally(query);
    }

    const rawCalories = sanitizeNumber(jsonResponse.calories, 0);
    const rawProtein = sanitizeNumber(jsonResponse.protein, 0);
    const rawCarbs = sanitizeNumber(jsonResponse.carbs, 0);
    const rawFat = sanitizeNumber(jsonResponse.fat, 0);
    const rawFiber = sanitizeNumber(jsonResponse.fiber, 0);
    const deficiencies = sanitizeStringArray(jsonResponse.deficiencies);
    const recommendations = sanitizeStringArray(jsonResponse.recommendations);

    const foodLog = await db.createFoodLog({
      userId: req.userId!,
      query,
      calories: Math.round(rawCalories),
      protein: Math.round(rawProtein * 10) / 10,
      carbs: Math.round(rawCarbs * 10) / 10,
      fat: Math.round(rawFat * 10) / 10,
      fiber: Math.round(rawFiber * 10) / 10,
      deficiencies,
      recommendations,
    });

    // Invalidate today's cache for the user
    const cacheKey = `nutrition_today_${req.userId}`;
    await redisClient.del(cacheKey);

    res.status(201).json(foodLog);
  } catch (error) {
    console.error('Analyze error:', error);
    res.status(500).json({ error: 'Failed to analyze nutrition' });
  }
});

router.get('/history', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const logs = await db.findFoodLogsByUserId(req.userId!);
    res.json(logs);
  } catch (error) {
    console.error('Fetch history error:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

router.get('/today', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const cacheKey = `nutrition_today_${req.userId}`;
    const cachedData = await redisClient.get(cacheKey);
    
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const logs = await db.findFoodLogsByUserIdAndDate(req.userId!, startOfDay, endOfDay);

    const summary = logs.reduce((acc: any, log: any) => ({
      calories: acc.calories + log.calories,
      protein: acc.protein + log.protein,
      carbs: acc.carbs + log.carbs,
      fat: acc.fat + log.fat,
      fiber: acc.fiber + log.fiber,
    }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });

    const responseData = { logs, summary };
    
    // Cache for 1 hour
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(responseData));

    res.json(responseData);
  } catch (error) {
    console.error('Fetch today nutrition error:', error);
    res.status(500).json({ error: 'Failed to fetch today\'s nutrition' });
  }
});

export default router;
