import React, { useState } from 'react';
import { PageTransition } from '../components/layout/PageTransition';
import { Button } from '../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, CheckCircle } from 'lucide-react';

export const FoodLogPage: React.FC = () => {
  const { authFetch } = useAuth();
  const [query, setQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsSubmitting(true);
    setErrorMsg(null);
    setResults(null);

    try {
      const res = await authFetch('/nutrition/analyze', {
        method: 'POST',
        body: JSON.stringify({ query })
      });
      
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to analyze intake');
      }
      setResults(json);
      setQuery(''); // Reset textarea
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Server connection failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate percentages for results macro bar
  let pPct = 0, cPct = 0, fPct = 0;
  if (results) {
    const totalGrams = results.protein + results.carbs + results.fat;
    if (totalGrams > 0) {
      pPct = Math.round((results.protein / totalGrams) * 100);
      cPct = Math.round((results.carbs / totalGrams) * 100);
      fPct = Math.round((results.fat / totalGrams) * 100);
    }
  }

  return (
    <PageTransition className="pt-32 pb-24 px-6 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-6xl sm:text-8xl mb-16">LOG INTAKE</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-12">
          <div className="relative">
            <textarea
              required
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What did you eat today? (e.g. Scrambled eggs with spinach, wheat toast, and black coffee)"
              className="w-full bg-transparent border-b-4 border-primary text-3xl sm:text-5xl font-heading font-medium outline-none py-4 placeholder-primary/20 resize-none h-48 focus:border-accent-red transition-colors"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <span className="opacity-50 text-sm uppercase tracking-widest">Natural language parsing system</span>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Analyzing...' : 'Analyze Meal'}
            </Button>
          </div>
        </form>

        {errorMsg && (
          <div className="bg-accent-red text-background font-bold px-4 py-3 mt-8 uppercase text-sm tracking-wider">
            {errorMsg}
          </div>
        )}

        <AnimatePresence>
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-24 border-t-4 border-primary pt-16 flex flex-col gap-16"
            >
              <div>
                <h2 className="text-xs uppercase tracking-widest opacity-50 mb-4">Meal Description Analyzed</h2>
                <p className="text-2xl sm:text-3xl font-medium italic">"{results.query}"</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                {/* Left metrics column */}
                <div className="flex flex-col justify-center">
                  <h3 className="text-sm uppercase tracking-widest opacity-50 mb-6">Calorie Load</h3>
                  <div className="flex items-baseline gap-4 mb-8">
                    <span className="font-heading font-bold text-[10vw] md:text-[6vw] leading-none tracking-tighter text-accent-red">
                      {results.calories}
                    </span>
                    <span className="text-xl font-medium opacity-50">KCAL</span>
                  </div>
                  
                  <div className="flex gap-8 border-t-2 border-primary pt-6">
                    <div>
                      <div className="font-heading text-3xl">{Math.round(results.protein)}g</div>
                      <div className="text-xs uppercase opacity-50">Protein</div>
                    </div>
                    <div>
                      <div className="font-heading text-3xl">{Math.round(results.carbs)}g</div>
                      <div className="text-xs uppercase opacity-50">Carbs</div>
                    </div>
                    <div>
                      <div className="font-heading text-3xl">{Math.round(results.fat)}g</div>
                      <div className="text-xs uppercase opacity-50">Fat</div>
                    </div>
                    <div>
                      <div className="font-heading text-3xl">{Math.round(results.fiber)}g</div>
                      <div className="text-xs uppercase opacity-50">Fiber</div>
                    </div>
                  </div>
                </div>

                {/* Right Macro bars column */}
                <div className="flex flex-col justify-center gap-6 border-l-2 border-primary pl-0 md:pl-12">
                  <h3 className="text-sm uppercase tracking-widest opacity-50">Macro Contribution</h3>
                  
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-xs font-bold uppercase">
                      <span>Protein</span>
                      <span>{pPct}%</span>
                    </div>
                    <div className="h-3 w-full bg-primary/10">
                      <div className="h-full bg-accent-red" style={{ width: `${pPct}%` }} />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-xs font-bold uppercase">
                      <span>Carbs</span>
                      <span>{cPct}%</span>
                    </div>
                    <div className="h-3 w-full bg-primary/10">
                      <div className="h-full bg-accent-orange" style={{ width: `${cPct}%` }} />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-xs font-bold uppercase">
                      <span>Fat</span>
                      <span>{fPct}%</span>
                    </div>
                    <div className="h-3 w-full bg-primary/10">
                      <div className="h-full bg-primary" style={{ width: `${fPct}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Warnings and Recommendations blocks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="bg-accent-pink text-primary p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <AlertCircle className="w-6 h-6 text-primary" />
                    <h4 className="font-heading text-sm uppercase tracking-widest">DEFICIENCIES SIGNALED</h4>
                  </div>
                  {results.deficiencies.length > 0 ? (
                    <ul className="flex flex-col gap-4">
                      {results.deficiencies.map((def: string, idx: number) => (
                        <li key={idx} className="font-heading text-2xl font-bold uppercase tracking-tight">
                          {def}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="font-medium opacity-80">No nutritional deficiencies detected in this meal log.</p>
                  )}
                </div>

                <div className="border-4 border-primary p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <CheckCircle className="w-6 h-6 text-accent-red" />
                      <h4 className="font-heading text-sm uppercase tracking-widest">BIO-RECOMMENDATIONS</h4>
                    </div>
                    <ul className="flex flex-col gap-4">
                      {results.recommendations.map((rec: string, idx: number) => (
                        <li key={idx} className="flex gap-3 items-start text-base font-medium">
                          <span className="font-heading text-accent-red font-bold text-lg">
                            {(idx + 1).toString().padStart(2, '0')}
                          </span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};

export default FoodLogPage;
