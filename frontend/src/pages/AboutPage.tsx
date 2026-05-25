import React from 'react';
import { PageTransition } from '../components/layout/PageTransition';
import { motion } from 'framer-motion';
import { Shield, Sparkles, Activity } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 100 } }
};

export const AboutPage: React.FC = () => {
  return (
    <PageTransition className="pt-32 pb-24 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto flex flex-col gap-24 relative z-10">
        
        {/* Editorial Title Section */}
        <header className="border-b-4 border-primary pb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="max-w-3xl">
            <span className="font-heading text-xs md:text-sm tracking-widest text-accent-red font-bold uppercase mb-4 block">
              [ PHILOSOPHY ]
            </span>
            <h1 className="text-6xl sm:text-8xl tracking-tighter leading-none">
              RECLAIM YOUR <span className="text-accent-orange">BIOLOGY</span>
            </h1>
          </div>
          <div className="text-right">
            <span className="font-heading text-xl font-bold border-2 border-primary px-4 py-2 bg-background shadow-[3px_3px_0px_0px_#1E1E1E]">
              EST. 2026
            </span>
          </div>
        </header>

        {/* Narrative Block */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
          <div className="lg:col-span-7 flex flex-col gap-8">
            <h2 className="text-3xl sm:text-5xl font-heading tracking-tight leading-tight">
              TRADITIONAL DIETARY TRACKING IS BROKEN. WE STRIPPED AWAY THE NOISE.
            </h2>
            <p className="text-lg font-medium opacity-80 leading-relaxed">
              Standard nutrition apps overload your senses with infinite search portals, barcode scanners, commercial advertisements, and bloated features. They turn a simple habit of biological self-awareness into an administrative chore.
            </p>
            <p className="text-lg font-medium opacity-80 leading-relaxed">
              Nutrobot was built for purists. We believe biometric telemetry should be elegant, immediate, and editorial. By leveraging natural language processing, you log what you eat in plain words, and our engine takes care of the math.
            </p>
          </div>
          <div className="lg:col-span-5 border-4 border-primary p-8 bg-[#D9D6D0] shadow-[8px_8px_0px_0px_#DB4A2B] flex flex-col gap-6">
            <h3 className="font-heading text-2xl tracking-tight text-accent-red">THE TENETS</h3>
            <ul className="flex flex-col gap-4 font-heading text-sm uppercase tracking-wider">
              <li className="flex gap-3 items-center border-b border-primary/20 pb-3">
                <span className="text-accent-red">✓</span> Zero manual portion division
              </li>
              <li className="flex gap-3 items-center border-b border-primary/20 pb-3">
                <span className="text-accent-orange">✓</span> Swiss Brutalist layout grid
              </li>
              <li className="flex gap-3 items-center border-b border-primary/20 pb-3">
                <span className="text-accent-pink">✓</span> Focus on macro density ratios
              </li>
              <li className="flex gap-3 items-center">
                <span className="text-primary">✓</span> Immediate deficiency telemetry
              </li>
            </ul>
          </div>
        </section>

        {/* Core Pillars Grid */}
        <section className="border-t-2 border-primary/20 pt-16">
          <h3 className="font-heading text-xs tracking-widest opacity-50 uppercase mb-12">SYSTEM PILLARS</h3>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
          >
            {/* Pillar 1 */}
            <motion.div 
              variants={itemVariants} 
              className="border-2 border-primary p-8 bg-background flex flex-col justify-between min-h-[300px] hover:shadow-[6px_6px_0px_0px_#DB4A2B] hover:translate-y-[-2px] hover:translate-x-[-2px] transition-all duration-300"
            >
              <div>
                <Activity className="w-10 h-10 text-accent-red mb-6" />
                <h4 className="font-heading text-2xl tracking-tight mb-4">TACTICAL MINIMALISM</h4>
                <p className="text-sm font-medium opacity-75 leading-relaxed">
                  We render raw data cleanly. No graphs with flashing buttons, no gamified badges. Just clean grids, bold numbers, and pure telemetry.
                </p>
              </div>
              <span className="text-accent-red font-heading text-xs font-bold tracking-widest mt-8">[ PILLAR_01 ]</span>
            </motion.div>

            {/* Pillar 2 */}
            <motion.div 
              variants={itemVariants}
              className="border-2 border-primary p-8 bg-background flex flex-col justify-between min-h-[300px] hover:shadow-[6px_6px_0px_0px_#F8A348] hover:translate-y-[-2px] hover:translate-x-[-2px] transition-all duration-300"
            >
              <div>
                <Sparkles className="w-10 h-10 text-accent-orange mb-6" />
                <h4 className="font-heading text-2xl tracking-tight mb-4">NATURAL GRAMMAR</h4>
                <p className="text-sm font-medium opacity-75 leading-relaxed">
                  Simply speak or type your intake: "Three soft-boiled eggs, half an avocado, and a cup of black coffee." The language model translates it to grams.
                </p>
              </div>
              <span className="text-accent-orange font-heading text-xs font-bold tracking-widest mt-8">[ PILLAR_02 ]</span>
            </motion.div>

            {/* Pillar 3 */}
            <motion.div 
              variants={itemVariants}
              className="border-2 border-primary p-8 bg-background flex flex-col justify-between min-h-[300px] hover:shadow-[6px_6px_0px_0px_#FF89A9] hover:translate-y-[-2px] hover:translate-x-[-2px] transition-all duration-300"
            >
              <div>
                <Shield className="w-10 h-10 text-accent-pink mb-6" />
                <h4 className="font-heading text-2xl tracking-tight mb-4">BIOMETRIC INTEGRITY</h4>
                <p className="text-sm font-medium opacity-75 leading-relaxed">
                  We look at your daily logs to evaluate vital targets like protein, fat, and fiber, signaling micro-deficiencies and giving functional food targets.
                </p>
              </div>
              <span className="text-accent-pink font-heading text-xs font-bold tracking-widest mt-8">[ PILLAR_03 ]</span>
            </motion.div>

          </motion.div>
        </section>

      </div>
    </PageTransition>
  );
};

export default AboutPage;
