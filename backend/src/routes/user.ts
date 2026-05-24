import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { db } from '../prisma';

const router = Router();

router.get('/profile', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await db.findUserById(req.userId!);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ id: user.id, email: user.email, name: user.name });
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

router.put('/profile', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const user = await db.updateUser(req.userId!, { name });
    
    res.json({ id: user.id, email: user.email, name: user.name });
  } catch (error) {
    console.error('Failed to update profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;
