import React, { useState } from 'react';
import { PageTransition } from '../components/layout/PageTransition';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Flame, Moon, Brain, ShieldAlert, Check } from 'lucide-react';

export interface Protocol {
  id: string;
  name: string;
  tagline: string;
  icon: React.ReactNode;
  accent: string;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  supplements: string[];
  habits: string[];
  description: string;
}

const PROTOCOLS: Protocol[] = [
  {
    id: 'mitochondrial_reset',
    name: 'Mitochondrial Reset',
    tagline: 'High-Fat / Ketogenic bio-energy protocol',
    icon: <Flame className="w-8 h-8" />,
    accent: '#DB4A2B', // Accent Red
    macros: { protein: 20, carbs: 10, fat: 70, fiber: 25 },
    supplements: ['CoQ10 (Ubiquinol) 200mg', 'Magnesium L-Threonate 140mg', 'Pure C8 MCT Oil 15ml'],
    habits: ['16/8 Intermittent Fasting window', '3-minute cold exposure on waking', 'No screens after 21:00'],
    description: 'Designed to optimize cellular energy production by shifting metabolism from glucose to high-efficiency ketones. Promotes cognitive endurance and mitochondrial biogenesis.'
  },
  {
    id: 'circadian_alignment',
    name: 'Circadian Alignment',
    tagline: 'Macro timing & hormone optimization protocol',
    icon: <Moon className="w-8 h-8" />,
    accent: '#F8A348', // Accent Orange
    macros: { protein: 30, carbs: 45, fat: 25, fiber: 35 },
    supplements: ['Vitamin D3/K2 5000IU', 'Zinc Picolinate 30mg', 'KSM-66 Ashwagandha 600mg'],
    habits: ['Solar light exposure within 30m of waking', 'No caloric intake 3 hours before sleep', 'Daily 30-minute zone 2 cardio'],
    description: 'Built to synchronize cortisol and melatonin output. Macro distribution is balanced to provide clean sustained daylight energy and promote serotonin synthesis in the evening.'
  },
  {
    id: 'cognitive_catalyst',
    name: 'Cognitive Catalyst',
    tagline: 'Neurotransmitter & focus amplification protocol',
    icon: <Brain className="w-8 h-8" />,
    accent: '#FF89A9', // Accent Pink
    macros: { protein: 40, carbs: 30, fat: 30, fiber: 30 },
    supplements: ['Alpha-GPC 300mg', 'L-Tyrosine 1000mg', 'High-EPA Omega-3 Fish Oil 2000mg'],
    habits: ['90-minute morning deep-focus blocks', 'Caffeine intake delayed 90m post-wake', '20-minute daily NSDR (Non-Sleep Deep Rest)'],
    description: 'Formulated to supply the precursor amino acids necessary for dopamine and acetylcholine synthesis. Perfect for high-intensity mental work and cognitive clarity.'
  },
  {
    id: 'micronutrient_saturation',
    name: 'Micronutrient Saturation',
    tagline: 'Gut microbiome & cellular longevity protocol',
    icon: <ShieldAlert className="w-8 h-8" />,
    accent: '#1E1E1E', // Primary
    macros: { protein: 25, carbs: 50, fat: 25, fiber: 45 },
    supplements: ['High-Potency Multi-Strain Probiotics', 'Methylated B-Complex', 'Spirulina & Chlorella powder'],
    habits: ['Consume 10 distinct colors of vegetables', 'Consuming 3.5L of filtered water', '7.5 - 8.5 hours of tracked deep sleep'],
    description: 'Focuses on heavy prebiotic fiber intake to nourish gut microbiotics. Cellular saturation of essential minerals and vitamins promotes DNA repair pathways and long-term metabolic health.'
  }
];

export const ProtocolPage: React.FC = () => {
  const [activeId, setActiveId] = useState<string | null>(localStorage.getItem('nutrobot_active_protocol'));
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  const handleActivate = (id: string) => {
    if (activeId === id) {
      localStorage.removeItem('nutrobot_active_protocol');
      setActiveId(null);
      triggerAlert('Protocol Deactivated. Dashboard metrics reset to default.');
    } else {
      localStorage.setItem('nutrobot_active_protocol', id);
      setActiveId(id);
      const name = PROTOCOLS.find(p => p.id === id)?.name;
      triggerAlert(`PROTOCOL ACTIVATED: ${name}. Your Dashboard telemetry is now configured.`);
    }
  };

  const triggerAlert = (msg: string) => {
    setAlertMsg(msg);
    setTimeout(() => {
      setAlertMsg(null);
    }, 4000);
  };

  return (
    <PageTransition className="pt-32 pb-24 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto flex flex-col gap-24 relative z-10">
        
        {/* Header Block */}
        <header className="border-b-4 border-primary pb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="max-w-3xl">
            <span className="font-heading text-xs md:text-sm tracking-widest text-accent-red font-bold uppercase mb-4 block">
              [ SYSTEMS TEMPLATE ]
            </span>
            <h1 className="text-6xl sm:text-8xl tracking-tighter leading-none">
              BIOMATIC <span className="text-accent-red">PROTOCOLS</span>
            </h1>
          </div>
          <p className="max-w-sm text-sm font-medium opacity-75">
            Select a specialized metabolic baseline. Activating a protocol overrides your default dashboard telemetry to measure your daily food logs against custom bio-targets.
          </p>
        </header>

        {/* Global Toast Alert */}
        <AnimatePresence>
          {alertMsg && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-primary text-background border-2 border-background p-4 font-heading font-bold text-sm tracking-wider uppercase shadow-[4px_4px_0px_0px_#DB4A2B]"
            >
              {alertMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Protocols Stack (Sticky Deck of Cards) */}
        <section className="flex flex-col gap-12 relative pb-32">
          {PROTOCOLS.map((protocol, index) => {
            const isActive = activeId === protocol.id;
            const isExpanded = expandedId === protocol.id;

            return (
              <motion.div
                key={protocol.id}
                layout
                className={`sticky border-4 border-primary p-8 bg-background flex flex-col justify-between transition-all duration-300 relative ${
                  isActive ? 'shadow-[8px_8px_0px_0px_#DB4A2B]' : 'hover:shadow-[6px_6px_0px_0px_#1E1E1E]'
                }`}
                style={{ 
                  borderColor: isActive ? '#DB4A2B' : '#1E1E1E',
                  top: `${120 + index * 40}px`,
                  zIndex: 10 + index
                }}
              >
                {/* Active Indicator Pin */}
                {isActive && (
                  <div className="absolute top-4 right-4 bg-accent-red text-background font-heading text-xs font-bold uppercase px-3 py-1 flex items-center gap-1">
                    <Check className="w-3 h-3" /> ACTIVE BASELINE
                  </div>
                )}

                <div>
                  {/* Top Line Info */}
                  <div className="flex items-center gap-4 mb-6">
                    <div 
                      className="p-3 border-2 border-primary rounded-none text-background"
                      style={{ backgroundColor: protocol.accent }}
                    >
                      {protocol.icon}
                    </div>
                    <div>
                      <h3 className="font-heading text-2xl tracking-tight uppercase">
                        {protocol.name}
                      </h3>
                      <p className="text-xs uppercase tracking-widest opacity-60">
                        {protocol.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm font-medium opacity-80 leading-relaxed mb-6">
                    {protocol.description}
                  </p>

                  {/* Collapsible details section */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t-2 border-primary/20 pt-6 mt-6 flex flex-col gap-6"
                      >
                        {/* Macros Breakdown */}
                        <div>
                          <h4 className="font-heading text-xs tracking-widest opacity-50 uppercase mb-3">Target Macro Ratios</h4>
                          <div className="grid grid-cols-4 gap-4 text-center">
                            <div className="bg-primary/5 p-2 border border-primary/20">
                              <span className="font-heading text-lg block">{protocol.macros.protein}%</span>
                              <span className="text-xxs uppercase tracking-wider opacity-60">Protein</span>
                            </div>
                            <div className="bg-primary/5 p-2 border border-primary/20">
                              <span className="font-heading text-lg block">{protocol.macros.carbs}%</span>
                              <span className="text-xxs uppercase tracking-wider opacity-60">Carbs</span>
                            </div>
                            <div className="bg-primary/5 p-2 border border-primary/20">
                              <span className="font-heading text-lg block">{protocol.macros.fat}%</span>
                              <span className="text-xxs uppercase tracking-wider opacity-60">Fats</span>
                            </div>
                            <div className="bg-primary/5 p-2 border border-primary/20">
                              <span className="font-heading text-lg block">{protocol.macros.fiber}g</span>
                              <span className="text-xxs uppercase tracking-wider opacity-60">Fiber</span>
                            </div>
                          </div>
                        </div>

                        {/* Supplements */}
                        <div>
                          <h4 className="font-heading text-xs tracking-widest opacity-50 uppercase mb-3">Synergistic Supplements</h4>
                          <ul className="text-xs font-medium opacity-85 flex flex-col gap-2">
                            {protocol.supplements.map((sup, idx) => (
                              <li key={idx} className="flex gap-2">
                                <span className="text-accent-red font-bold">•</span>
                                {sup}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Habits */}
                        <div>
                          <h4 className="font-heading text-xs tracking-widest opacity-50 uppercase mb-3">System Habits</h4>
                          <ul className="text-xs font-medium opacity-85 flex flex-col gap-2">
                            {protocol.habits.map((habit, idx) => (
                              <li key={idx} className="flex gap-2">
                                <span className="text-accent-orange font-bold">•</span>
                                {habit}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Actions Row */}
                <div className="flex gap-4 mt-8 pt-6 border-t border-primary/10">
                  <Button 
                    variant={isActive ? 'secondary' : 'primary'}
                    onClick={() => handleActivate(protocol.id)}
                    className="flex-1 text-center justify-center"
                  >
                    {isActive ? 'Deactivate' : 'Activate Baseline'}
                  </Button>
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : protocol.id)}
                    className="font-heading text-xs font-bold uppercase tracking-wider border-2 border-primary px-4 py-2 hover:bg-primary hover:text-background transition-all"
                  >
                    {isExpanded ? 'Collapse' : 'Details'}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </section>

      </div>
    </PageTransition>
  );
};

export default ProtocolPage;
