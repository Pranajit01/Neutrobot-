import React, { Suspense, useState } from 'react';
import { PageTransition } from '../components/layout/PageTransition';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Mail, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

// Dynamic import for the 3D background to keep initial bundle smaller
const TubesBackground = React.lazy(() => import('../components/ui/TubesBackground'));

interface SocialLinkProps {
  href: string;
  label: string;
  value: string;
  icon: React.ReactNode;
  brandColor: string;
}

const SocialLink: React.FC<SocialLinkProps> = ({ href, label, value, icon, brandColor }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ 
        y: -6, 
        borderColor: '#1E1E1E',
        boxShadow: '6px 6px 0px 0px #1E1E1E'
      }}
      whileTap={{ y: 0, boxShadow: '2px 2px 0px 0px #1E1E1E' }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      className="relative overflow-hidden flex justify-between items-center border-2 border-transparent border-b-primary/20 py-5 px-6 bg-transparent group cursor-pointer"
    >
      {/* Background slide element */}
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isHovered ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        style={{ 
          backgroundColor: brandColor,
          originX: 0 
        }}
      />
      
      {/* Left side content */}
      <div className="relative z-10 flex items-center gap-4">
        <motion.div 
          animate={{ color: isHovered ? '#FFFFFF' : brandColor }}
          transition={{ duration: 0.2 }}
        >
          {icon}
        </motion.div>
        <motion.span 
          animate={{ color: isHovered ? '#FFFFFF' : '#1E1E1E' }}
          className="font-heading text-lg font-bold uppercase tracking-tight"
        >
          {label}
        </motion.span>
      </div>
      
      {/* Right side content */}
      <div className="relative z-10 flex items-center gap-2">
        <motion.span 
          animate={{ color: isHovered ? '#FFFFFF' : '#1E1E1E', x: isHovered ? -4 : 0 }}
          className="font-medium text-sm sm:text-base opacity-90"
        >
          {value}
        </motion.span>
        
        {/* Shooting Arrow */}
        <motion.div
          animate={isHovered ? {
            x: [0, 15, -15, 0],
            y: [0, -15, 15, 0],
            opacity: [1, 0, 0, 1]
          } : { x: 0, y: 0, opacity: 1 }}
          transition={{ 
            duration: 0.45, 
            ease: "easeInOut",
            times: [0, 0.4, 0.45, 1]
          }}
          className={isHovered ? 'text-white' : 'text-primary/75'}
        >
          <ArrowUpRight className="w-5 h-5" />
        </motion.div>
      </div>
    </motion.a>
  );
};

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
            <h1 
              style={{ textShadow: '4px 4px 0px #DB4A2B, 8px 8px 0px #1E1E1E' }}
              className="text-[15vw] sm:text-[18vw] leading-tighter tracking-tighter select-none"
            >
              NUTRO
            </h1>
            <h1 
              style={{ textShadow: '4px 4px 0px #1E1E1E, 8px 8px 0px #FF89A9' }}
              className="text-[15vw] sm:text-[18vw] leading-tighter tracking-tighter sm:ml-[15vw] text-accent-red select-none"
            >
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
            
            <SocialLink 
              href="https://www.linkedin.com/in/pranajit-ai"
              label="Linkedin"
              value="pranajit-ai"
              brandColor="#DB4A2B"
              icon={
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              }
            />

            <SocialLink 
              href="https://instagram.com/eccentric_pj"
              label="Instagram"
              value="@eccentric_pj"
              brandColor="#F8A348"
              icon={
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              }
            />

            <SocialLink 
              href="mailto:daspranajit973@gmail.com"
              label="Email"
              value="daspranajit973@gmail.com"
              brandColor="#FF89A9"
              icon={<Mail className="w-6 h-6" />}
            />

          </div>
        </div>
      </section>

    </PageTransition>
  );
};

export default HeroPage;
