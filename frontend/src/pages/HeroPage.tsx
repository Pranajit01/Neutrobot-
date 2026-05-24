import React, { Suspense } from 'react';
import { PageTransition } from '../components/layout/PageTransition';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Mail, ArrowUpRight } from 'lucide-react';

// Dynamic import for the 3D background to keep initial bundle smaller
const TubesBackground = React.lazy(() => import('../components/ui/TubesBackground'));

export const HeroPage: React.FC = () => {
  const navigate = useNavigate();
  const handleScrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <PageTransition className="relative w-full overflow-x-hidden bg-transparent">
      
      {/* Hero Fold (Full Viewport) */}
      <div className="relative min-h-screen flex flex-col justify-center px-6 pt-24 pb-12">
        <Suspense fallback={null}>
          <TubesBackground />
        </Suspense>
        
        <div className="relative z-10 flex flex-col gap-12 max-w-7xl mx-auto w-full">
          <div className="flex flex-col">
            <h1 className="text-[15vw] sm:text-[18vw] leading-tighter tracking-tighter select-none">
              NUTRO
            </h1>
            <h1 className="text-[15vw] sm:text-[18vw] leading-tighter tracking-tighter sm:ml-[15vw] text-accent-red select-none">
              BOT
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-8 mt-12 sm:ml-[15vw]">
            <p className="max-w-[400px] text-lg sm:text-xl font-medium opacity-80 leading-relaxed">
              Reclaim your biology. Advanced nutrition analysis and wellness tracking stripped of all the noise.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center pointer-events-auto">
              <Button onClick={() => navigate('/dashboard')}>
                Start Tracking
              </Button>
              <Button variant="secondary" onClick={handleScrollToHowItWorks}>
                How it works
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Divider */}
      <section id="how-it-works-section" className="w-full py-32 px-6 border-t-4 border-primary relative z-10 bg-[#E4E2DD]">
        <div className="max-w-7xl mx-auto flex flex-col gap-24">
          <div className="flex justify-between items-start">
            <h2 className="text-[10vw] font-heading font-bold uppercase tracking-tighter leading-none text-primary/95 select-none">
              HOW IT WORKS
            </h2>
            <span className="font-heading text-lg text-accent-red font-bold uppercase tracking-widest pt-4">
              [ PROTOCOL ]
            </span>
          </div>

          {/* 4 Step Process Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-16 border-t-2 border-primary/25 pt-12">
            
            <div className="flex flex-col gap-6">
              <span className="font-heading text-4xl text-accent-red">01</span>
              <h3 className="font-heading text-xl tracking-tight">ACCESS</h3>
              <p className="text-sm font-medium opacity-75 leading-relaxed">
                Configure your credential token. Create your user account to initialize your personal tracking matrix.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <span className="font-heading text-4xl text-accent-orange">02</span>
              <h3 className="font-heading text-xl tracking-tight">LOG MEALS</h3>
              <p className="text-sm font-medium opacity-75 leading-relaxed">
                Describe your food log in natural language. Type what you ate without parsing columns or portions manually.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <span className="font-heading text-4xl text-accent-pink">03</span>
              <h3 className="font-heading text-xl tracking-tight">ANALYSIS</h3>
              <p className="text-sm font-medium opacity-75 leading-relaxed">
                The engine breaks down total calories, protein, carbs, fats, and fiber, evaluating biological markers.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <span className="font-heading text-4xl text-primary">04</span>
              <h3 className="font-heading text-xl tracking-tight">OPTIMIZE</h3>
              <p className="text-sm font-medium opacity-75 leading-relaxed">
                Receive specific deficiency warnings and personalized recommendations to restore system balance.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Campaign Connect Block */}
      <section className="w-full bg-[#D9D6D0] py-32 px-6 border-t-4 border-primary relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          
          {/* Left Column - Large Editorial Header */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <h2 className="text-[6vw] font-heading font-bold uppercase tracking-tighter leading-none select-none">
              CONNECT WITH THE ARCHITECT
            </h2>
            <p className="text-lg font-medium opacity-80 max-w-md mt-8 leading-relaxed">
              Reach out to discuss system optimizations, technical features, or collaboration.
            </p>
          </div>

          {/* Right Column - Contact Stack */}
          <div className="lg:col-span-5 flex flex-col justify-center gap-6 border-l-2 border-primary pl-0 lg:pl-12">
            
            {/* LinkedIn */}
            <div className="flex justify-between items-center border-b-2 border-primary/20 pb-4">
              <div className="flex items-center gap-4">
                <svg className="w-6 h-6 text-accent-red" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
                <span className="font-heading text-lg font-bold uppercase">LINKEDIN</span>
              </div>
              <a 
                href="https://www.linkedin.com/in/pranajit-ai" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-1 font-medium hover:text-accent-red transition-colors"
              >
                <span>pranajit-ai</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>

            {/* Instagram */}
            <div className="flex justify-between items-center border-b-2 border-primary/20 pb-4">
              <div className="flex items-center gap-4">
                <svg className="w-6 h-6 text-accent-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                <span className="font-heading text-lg font-bold uppercase">INSTAGRAM</span>
              </div>
              <a 
                href="https://instagram.com/eccentric_pj" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-1 font-medium hover:text-accent-orange transition-colors"
              >
                <span>@eccentric_pj</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>

            {/* Email */}
            <div className="flex justify-between items-center pb-2">
              <div className="flex items-center gap-4">
                <Mail className="w-6 h-6 text-accent-pink" />
                <span className="font-heading text-lg font-bold uppercase">EMAIL</span>
              </div>
              <a 
                href="mailto:daspranajit973@gmail.com" 
                className="flex items-center gap-1 font-medium hover:text-accent-pink transition-colors"
              >
                <span>daspranajit973@gmail.com</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>

          </div>
        </div>
      </section>

    </PageTransition>
  );
};

export default HeroPage;
