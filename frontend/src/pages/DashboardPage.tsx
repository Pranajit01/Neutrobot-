import React, { useEffect, useState } from 'react';
import { PageTransition } from '../components/layout/PageTransition';
import { useAuth } from '../context/AuthContext';

export const DashboardPage: React.FC = () => {
  const { authFetch, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({
    summary: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
    logs: []
  });

  useEffect(() => {
    const fetchTodayData = async () => {
      try {
        const res = await authFetch('/nutrition/today');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error('Failed to fetch today nutrition:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTodayData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-heading text-4xl">
        SYNCHRONIZING SYSTEM...
      </div>
    );
  }

  const { summary, logs } = data;

  // Calculate macro percentages based on grams
  const totalGrams = summary.protein + summary.carbs + summary.fat;
  const pPct = totalGrams > 0 ? Math.round((summary.protein / totalGrams) * 100) : 0;
  const cPct = totalGrams > 0 ? Math.round((summary.carbs / totalGrams) * 100) : 0;
  const fPct = totalGrams > 0 ? Math.round((summary.fat / totalGrams) * 100) : 0;

  // Compile deficiencies and recommendations from today's logs
  const deficiencies = Array.from(
    new Set<string>(logs.flatMap((log: any) => log.deficiencies || []))
  );
  const recommendations = Array.from(
    new Set<string>(logs.flatMap((log: any) => log.recommendations || []))
  );

  return (
    <PageTransition className="pt-32 pb-24 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto flex flex-col gap-24">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-end gap-8 border-b-2 border-primary pb-8">
          <div>
            <h2 className="text-xl font-medium opacity-50 mb-4">
              WELCOME BACK, {user?.name?.toUpperCase() || 'USER'}
            </h2>
            <h1 className="text-6xl sm:text-8xl">DASHBOARD</h1>
          </div>
          <div className="text-right">
            <h3 className="text-3xl font-heading uppercase text-accent-red">
              SYSTEM ONLINE
            </h3>
            <p className="opacity-70 uppercase tracking-widest text-sm mt-2">
              {logs.length} Meals Logged Today
            </p>
          </div>
        </header>

        {/* Top asymmetrical grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          {/* Today's Intake (Oversized Metric) */}
          <section className="lg:col-span-7 flex flex-col justify-center">
            <h3 className="text-sm uppercase tracking-widest opacity-50 mb-6">Today's Intake</h3>
            <div className="flex items-baseline gap-4">
              <span className="font-heading font-bold text-[12vw] lg:text-[8vw] leading-none tracking-tighter">
                {summary.calories.toLocaleString()}
              </span>
              <span className="text-2xl font-medium opacity-50">KCAL</span>
            </div>
            <div className="mt-8 flex gap-8 border-t-2 border-primary pt-6">
              <div className="flex flex-col">
                <span className="font-heading text-4xl">{Math.round(summary.protein)}g</span>
                <span className="text-xs uppercase tracking-widest opacity-50">Protein</span>
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-4xl">{Math.round(summary.carbs)}g</span>
                <span className="text-xs uppercase tracking-widest opacity-50">Carbs</span>
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-4xl">{Math.round(summary.fat)}g</span>
                <span className="text-xs uppercase tracking-widest opacity-50">Fat</span>
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-4xl">{Math.round(summary.fiber)}g</span>
                <span className="text-xs uppercase tracking-widest opacity-50">Fiber</span>
              </div>
            </div>
          </section>

          {/* Macro Breakdown (Minimal Horizontal Bars) */}
          <section className="lg:col-span-5 flex flex-col justify-center gap-8 border-l-2 border-primary pl-0 lg:pl-12">
            <h3 className="text-sm uppercase tracking-widest opacity-50">Macro Balance</h3>
            
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm font-bold uppercase">
                <span>Protein</span>
                <span>{pPct}%</span>
              </div>
              <div className="h-4 w-full bg-primary/10">
                <div 
                  className="h-full bg-accent-red transition-all duration-500" 
                  style={{ width: `${pPct}%` }} 
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm font-bold uppercase">
                <span>Carbs</span>
                <span>{cPct}%</span>
              </div>
              <div className="h-4 w-full bg-primary/10">
                <div 
                  className="h-full bg-accent-orange transition-all duration-500" 
                  style={{ width: `${cPct}%` }} 
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm font-bold uppercase">
                <span>Fat</span>
                <span>{fPct}%</span>
              </div>
              <div className="h-4 w-full bg-primary/10">
                <div 
                  className="h-full bg-primary transition-all duration-500" 
                  style={{ width: `${fPct}%` }} 
                />
              </div>
            </div>
          </section>
        </div>

        {/* Signals and Recommendations (Printed Layout style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
          <section className="bg-primary text-background p-12 relative overflow-hidden">
            <h3 className="text-sm uppercase tracking-widest opacity-50 mb-12">Deficiency Signals</h3>
            <div className="relative z-10">
              {deficiencies.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {deficiencies.map((def, idx) => (
                    <h4 key={idx} className="font-heading text-4xl sm:text-5xl text-accent-pink uppercase">
                      {def}
                    </h4>
                  ))}
                  <p className="opacity-80 max-w-sm mt-4">
                    Your recent food logs indicate potential deficiencies in these nutrients. Consider balancing your next intake.
                  </p>
                </div>
              ) : (
                <div>
                  <h4 className="font-heading text-4xl sm:text-5xl text-accent-pink">NO ALERTS</h4>
                  <p className="opacity-80 max-w-sm mt-4">
                    No bio-deficiency alerts found for your intake today.
                  </p>
                </div>
              )}
            </div>
            <span className="absolute bottom-[-10%] right-[-5%] font-heading font-bold text-[15rem] leading-none opacity-5 select-none pointer-events-none">
              !
            </span>
          </section>

          <section className="border-2 border-primary p-12 flex flex-col justify-between">
            <div>
              <h3 className="text-sm uppercase tracking-widest opacity-50 mb-8">Recommendations</h3>
              {recommendations.length > 0 ? (
                <ul className="flex flex-col gap-6">
                  {recommendations.slice(0, 3).map((rec, idx) => (
                    <li key={idx} className="flex gap-4 items-start border-b-2 border-primary/20 pb-4 last:border-0 last:pb-0">
                      <span className="font-heading text-accent-red text-xl">
                        {(idx + 1).toString().padStart(2, '0')}
                      </span>
                      <p className="font-medium">{rec}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="font-medium opacity-60">
                  Log a meal today to generate dynamic bio-recommendations.
                </p>
              )}
            </div>
            <button 
              onClick={() => window.location.href = '/log'}
              className="mt-12 text-left uppercase font-heading font-bold text-accent-red hover:text-primary transition-colors flex items-center gap-2"
            >
              Log A New Meal &rarr;
            </button>
          </section>
        </div>

      </div>
    </PageTransition>
  );
};

export default DashboardPage;
