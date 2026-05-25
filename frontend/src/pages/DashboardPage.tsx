import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTransition } from '../components/layout/PageTransition';
import { useAuth } from '../context/AuthContext';
import { Flame, Moon, Brain, ShieldCheck } from 'lucide-react';

const PROTOCOLS_MAP: Record<string, { name: string; tagline: string; accent: string; icon: React.ReactNode; macros: { protein: number; carbs: number; fat: number; fiber: number } }> = {
  mitochondrial_reset: {
    name: 'Mitochondrial Reset',
    tagline: 'High-Fat / Ketogenic bio-energy protocol',
    accent: '#DB4A2B',
    icon: <Flame className="w-5 h-5 text-accent-red" />,
    macros: { protein: 20, carbs: 10, fat: 70, fiber: 25 }
  },
  circadian_alignment: {
    name: 'Circadian Alignment',
    tagline: 'Macro timing & hormone optimization protocol',
    accent: '#F8A348',
    icon: <Moon className="w-5 h-5 text-accent-orange" />,
    macros: { protein: 30, carbs: 45, fat: 25, fiber: 35 }
  },
  cognitive_catalyst: {
    name: 'Cognitive Catalyst',
    tagline: 'Neurotransmitter & focus amplification protocol',
    accent: '#FF89A9',
    icon: <Brain className="w-5 h-5 text-accent-pink" />,
    macros: { protein: 40, carbs: 30, fat: 30, fiber: 30 }
  },
  micronutrient_saturation: {
    name: 'Micronutrient Saturation',
    tagline: 'Gut microbiome & cellular longevity protocol',
    accent: '#1E1E1E',
    icon: <ShieldCheck className="w-5 h-5 text-primary" />,
    macros: { protein: 25, carbs: 50, fat: 25, fiber: 45 }
  }
};

export const DashboardPage: React.FC = () => {
  const { authFetch, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeProtocolId, setActiveProtocolId] = useState<string | null>(null);
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
    
    // Fetch active bio-protocol
    const protoId = localStorage.getItem('nutrobot_active_protocol');
    if (protoId && PROTOCOLS_MAP[protoId]) {
      setActiveProtocolId(protoId);
    }

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
  const activeProtocol = activeProtocolId ? PROTOCOLS_MAP[activeProtocolId] : null;

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
      <div className="max-w-7xl mx-auto flex flex-col gap-20">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b-2 border-primary pb-8">
          <div>
            <h2 className="text-xl font-medium opacity-50 mb-4 flex items-center gap-2">
              WELCOME BACK, {user?.name?.toUpperCase() || 'USER'} 
              {activeProtocol && (
                <span className="text-xxs px-2.5 py-0.5 border border-accent-red text-accent-red font-heading uppercase tracking-widest font-bold bg-background">
                  {activeProtocol.name} ACTIVE
                </span>
              )}
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

        {/* Active Protocol Banner */}
        {activeProtocol && (
          <div className="border-4 border-primary p-6 bg-[#D9D6D0] flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 shadow-[4px_4px_0px_0px_#DB4A2B]">
            <div className="flex items-center gap-4">
              <div className="p-2 border-2 border-primary bg-background">
                {activeProtocol.icon}
              </div>
              <div>
                <span className="font-heading text-xxs text-accent-red font-bold uppercase tracking-widest block">[ ACTIVE BASELINE ]</span>
                <h3 className="font-heading text-2xl tracking-tight">{activeProtocol.name.toUpperCase()}</h3>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 font-heading text-sm uppercase w-full lg:w-auto">
              <div className="flex flex-col border-l-2 border-primary/20 pl-4">
                <span className="opacity-50 text-xxs tracking-wider">Target Protein</span>
                <span className="text-lg font-bold">{activeProtocol.macros.protein}%</span>
              </div>
              <div className="flex flex-col border-l-2 border-primary/20 pl-4">
                <span className="opacity-50 text-xxs tracking-wider">Target Carbs</span>
                <span className="text-lg font-bold">{activeProtocol.macros.carbs}%</span>
              </div>
              <div className="flex flex-col border-l-2 border-primary/20 pl-4">
                <span className="opacity-50 text-xxs tracking-wider">Target Fat</span>
                <span className="text-lg font-bold">{activeProtocol.macros.fat}%</span>
              </div>
              <div className="flex flex-col border-l-2 border-primary/20 pl-4">
                <span className="opacity-50 text-xxs tracking-wider">Target Fiber</span>
                <span className="text-lg font-bold">{activeProtocol.macros.fiber}g</span>
              </div>
            </div>
          </div>
        )}

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
            <div className="mt-8 grid grid-cols-2 sm:flex sm:gap-8 border-t-2 border-primary pt-6 gap-y-6">
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
                <span className="font-heading text-4xl">
                  {Math.round(summary.fiber)}g
                  {activeProtocol && (
                    <span className="text-xs opacity-50 ml-1">/ {activeProtocol.macros.fiber}g</span>
                  )}
                </span>
                <span className="text-xs uppercase tracking-widest opacity-50">
                  Fiber {activeProtocol && 'Target'}
                </span>
              </div>
            </div>
          </section>

          {/* Macro Breakdown (Minimal Horizontal Bars) */}
          <section className="lg:col-span-5 flex flex-col justify-center gap-8 border-l-2 border-primary pl-0 lg:pl-12">
            <h3 className="text-sm uppercase tracking-widest opacity-50">Macro Balance</h3>
            
            {/* Protein Bar */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm font-bold uppercase">
                <span>Protein</span>
                <span>
                  {pPct}% {activeProtocol && <span className="opacity-50 font-normal">(Target: {activeProtocol.macros.protein}%)</span>}
                </span>
              </div>
              <div className="h-5 w-full bg-primary/10 relative border border-primary">
                <div 
                  className="h-full bg-accent-red transition-all duration-500" 
                  style={{ width: `${pPct}%` }} 
                />
                {activeProtocol && (
                  <div 
                    className="absolute top-0 bottom-0 w-1 bg-primary z-10" 
                    style={{ left: `${activeProtocol.macros.protein}%` }}
                    title={`Target: ${activeProtocol.macros.protein}%`}
                  />
                )}
              </div>
            </div>
            
            {/* Carbs Bar */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm font-bold uppercase">
                <span>Carbs</span>
                <span>
                  {cPct}% {activeProtocol && <span className="opacity-50 font-normal">(Target: {activeProtocol.macros.carbs}%)</span>}
                </span>
              </div>
              <div className="h-5 w-full bg-primary/10 relative border border-primary">
                <div 
                  className="h-full bg-accent-orange transition-all duration-500" 
                  style={{ width: `${cPct}%` }} 
                />
                {activeProtocol && (
                  <div 
                    className="absolute top-0 bottom-0 w-1 bg-primary z-10" 
                    style={{ left: `${activeProtocol.macros.carbs}%` }}
                    title={`Target: ${activeProtocol.macros.carbs}%`}
                  />
                )}
              </div>
            </div>

            {/* Fat Bar */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm font-bold uppercase">
                <span>Fat</span>
                <span>
                  {fPct}% {activeProtocol && <span className="opacity-50 font-normal">(Target: {activeProtocol.macros.fat}%)</span>}
                </span>
              </div>
              <div className="h-5 w-full bg-primary/10 relative border border-primary">
                <div 
                  className="h-full bg-primary transition-all duration-500" 
                  style={{ width: `${fPct}%` }} 
                />
                {activeProtocol && (
                  <div 
                    className="absolute top-0 bottom-0 w-1 bg-background z-10" 
                    style={{ left: `${activeProtocol.macros.fat}%` }}
                    title={`Target: ${activeProtocol.macros.fat}%`}
                  />
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Signals and Recommendations (Printed Layout style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
          <section className="bg-primary text-background p-6 sm:p-12 relative overflow-hidden">
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

          <section className="border-2 border-primary p-6 sm:p-12 flex flex-col justify-between">
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
              onClick={() => navigate('/log')}
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
