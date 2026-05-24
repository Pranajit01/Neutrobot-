import React, { Suspense } from 'react';
import { PageTransition } from '../components/layout/PageTransition';
import { Button } from '../components/ui/Button';

// Dynamic import for the 3D background to keep initial bundle smaller
const TubesBackground = React.lazy(() => import('../components/ui/TubesBackground'));

export const HeroPage: React.FC = () => {
  return (
    <PageTransition className="relative min-h-screen flex flex-col justify-center px-6 overflow-hidden pt-24">
      <Suspense fallback={null}>
        <TubesBackground />
      </Suspense>
      
      <div className="relative z-10 flex flex-col gap-12 max-w-7xl mx-auto w-full">
        <div className="flex flex-col">
          <h1 className="text-[15vw] sm:text-[18vw] leading-tighter tracking-tighter">
            NUTRO
          </h1>
          <h1 className="text-[15vw] sm:text-[18vw] leading-tighter tracking-tighter sm:ml-[15vw] text-accent-red">
            BOT
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-8 mt-12 sm:ml-[15vw]">
          <p className="max-w-[400px] text-lg sm:text-xl font-medium opacity-80 leading-relaxed">
            Reclaim your biology. Advanced nutrition analysis and wellness tracking stripped of all the noise.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center pointer-events-auto">
            <Button onClick={() => window.location.href = '/dashboard'}>
              Start Tracking
            </Button>
            <Button variant="secondary" onClick={() => {
              const el = document.getElementById('features');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}>
              How it works
            </Button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default HeroPage;
