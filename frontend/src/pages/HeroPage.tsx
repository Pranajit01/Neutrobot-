import React, { Suspense, useState } from 'react';
import { PageTransition } from '../components/layout/PageTransition';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Mail, ArrowUpRight } from 'lucide-react';
import { 
  motion, 
  useScroll, 
  useTransform, 
  useVelocity, 
  useSpring, 
  useAnimationFrame, 
  useMotionValue 
} from 'framer-motion';

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

// Scroll-Velocity Linked Marquee Component (Smooth & Clamped)
const ScrollMarquee: React.FC = () => {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 60, stiffness: 300 });
  
  // Clamp speed variations to keep text perfectly legible and slow down chaotic fast scrolls
  const velocityFactor = useTransform(smoothVelocity, [-1500, 1500], [-0.08, 0.08]);
  
  const baseSpeed = 0.025; // Super slow, elegant, readable base speed

  useAnimationFrame(() => {
    let moveBy = baseSpeed + velocityFactor.get();
    
    // Smooth boundary wrap for infinite scroll
    let newX = baseX.get() - moveBy;
    if (newX <= -50) {
      newX = 0;
    } else if (newX > 0) {
      newX = -50;
    }
    baseX.set(newX);
  });

  const x = useTransform(baseX, (v) => `${v}%`);

  return (
    <div className="w-full overflow-hidden bg-primary text-background py-8 border-y-4 border-primary flex whitespace-nowrap select-none font-heading text-4xl sm:text-6xl font-bold uppercase tracking-tighter relative z-20">
      <motion.div style={{ x }} className="flex gap-16 whitespace-nowrap min-w-max">
        <span>RECLAIM YOUR BIOLOGY • DECODE NUTRITION • SYSTEM UNLOCKED • OPTIMIZE HEALTH • NATURAL LANGUAGE ANALYSIS •</span>
        <span>RECLAIM YOUR BIOLOGY • DECODE NUTRITION • SYSTEM UNLOCKED • OPTIMIZE HEALTH • NATURAL LANGUAGE ANALYSIS •</span>
      </motion.div>
    </div>
  );
};

// Telemetry Scroll Gear Indicator
const TelemetryScrollIndicator: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 720]);
  const scale = useTransform(scrollYProgress, [0, 0.05], [0, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);
  
  const springRotate = useSpring(rotate, { damping: 15, stiffness: 80 });
  const springScale = useSpring(scale, { damping: 20, stiffness: 150 });
  const springOpacity = useSpring(opacity, { damping: 20, stiffness: 150 });
  
  return (
    <motion.div
      style={{ 
        rotate: springRotate, 
        scale: springScale, 
        opacity: springOpacity 
      }}
      className="fixed bottom-8 right-8 z-50 pointer-events-none hidden md:flex items-center justify-center w-16 h-16 rounded-full border-2 border-primary bg-background shadow-[4px_4px_0px_0px_#1E1E1E]"
    >
      <svg className="w-10 h-10 text-primary animate-pulse" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3">
        <circle cx="50" cy="50" r="40" strokeDasharray="6 4" />
        <circle cx="50" cy="50" r="25" />
        <circle cx="50" cy="50" r="10" fill="currentColor" />
        <line x1="50" y1="10" x2="50" y2="90" />
        <line x1="10" y1="50" x2="90" y2="50" />
      </svg>
    </motion.div>
  );
};

export const HeroPage: React.FC = () => {
  const navigate = useNavigate();
  const handleScrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const { scrollY } = useScroll();

  // Scroll animations values
  const springConfig = { damping: 25, stiffness: 100, mass: 0.5 };
  
  const xNutro = useSpring(useTransform(scrollY, [0, 600], [0, -120]), springConfig);
  const xBot = useSpring(useTransform(scrollY, [0, 600], [0, 120]), springConfig);
  const opacityTitle = useSpring(useTransform(scrollY, [0, 500], [1, 0]), springConfig);
  const scaleHero = useSpring(useTransform(scrollY, [0, 600], [1, 0.96]), springConfig);
  
  const yContent = useSpring(useTransform(scrollY, [0, 500], [0, 40]), springConfig);
  const opacityContent = useSpring(useTransform(scrollY, [0, 450], [1, 0]), springConfig);

  // Floating background shapes (Parallax)
  const yPlus = useSpring(useTransform(scrollY, [0, 1000], [0, -250]), springConfig);
  const rotatePlus = useSpring(useTransform(scrollY, [0, 1000], [0, 180]), springConfig);

  const ySquare = useSpring(useTransform(scrollY, [0, 1000], [0, -150]), springConfig);
  const rotateSquare = useSpring(useTransform(scrollY, [0, 1000], [0, -120]), springConfig);

  const yCircle = useSpring(useTransform(scrollY, [0, 1000], [0, -100]), springConfig);
  const scaleCircle = useSpring(useTransform(scrollY, [0, 1000], [1, 1.2]), springConfig);

  const yDash = useSpring(useTransform(scrollY, [0, 1000], [0, -280]), springConfig);

  // How it works items variants
  const cardVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.95, rotate: -2 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring" as const,
        stiffness: 90,
        damping: 14,
        delay: i * 0.12,
      }
    })
  };

  const socialContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const socialItemVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <PageTransition className="relative w-full overflow-x-hidden bg-transparent">
      <TelemetryScrollIndicator />

      {/* Hero Fold (Full Viewport) */}
      <motion.div 
        style={{ scale: scaleHero }}
        className="relative min-h-screen flex flex-col justify-center px-6 pt-24 pb-12 overflow-hidden z-10"
      >
        <Suspense fallback={null}>
          <TubesBackground />
        </Suspense>

        {/* Floating Brutalist Shapes in Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <motion.div 
            style={{ y: yPlus, rotate: rotatePlus }}
            className="absolute top-[22%] left-[8%] w-16 h-16 flex items-center justify-center text-primary/10 text-6xl font-bold select-none"
          >
            +
          </motion.div>
          
          <motion.div 
            style={{ y: ySquare, rotate: rotateSquare }}
            className="absolute top-[38%] right-[12%] w-24 h-24 border-4 border-dashed border-primary/10 select-none rounded-lg"
          />
          
          <motion.div 
            style={{ y: yCircle, scale: scaleCircle }}
            className="absolute top-[62%] left-[15%] w-36 h-36 border-4 border-primary/10 rounded-full select-none"
          />

          <motion.div 
            style={{ y: yDash, rotate: -35 }}
            className="absolute top-[12%] right-[22%] w-28 h-5 bg-primary/10 select-none"
          />
        </div>
        
        <div className="relative z-10 flex flex-col gap-12 max-w-7xl mx-auto w-full">
          <motion.div style={{ opacity: opacityTitle }} className="flex flex-col">
            <motion.h1 
              style={{ 
                x: xNutro,
                textShadow: '4px 4px 0px #DB4A2B, 8px 8px 0px #1E1E1E' 
              }}
              className="text-[15vw] sm:text-[18vw] leading-tighter tracking-tighter select-none w-fit"
            >
              NUTRO
            </motion.h1>
            <motion.h1 
              style={{ 
                x: xBot,
                textShadow: '4px 4px 0px #1E1E1E, 8px 8px 0px #FF89A9' 
              }}
              className="text-[15vw] sm:text-[18vw] leading-tighter tracking-tighter sm:ml-[15vw] text-accent-red select-none w-fit"
            >
              BOT
            </motion.h1>
          </motion.div>

          <motion.div 
            style={{ y: yContent, opacity: opacityContent }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-8 mt-12 sm:ml-[15vw]"
          >
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
          </motion.div>
        </div>
      </motion.div>

      {/* Dynamic Marquee Section */}
      <ScrollMarquee />

      {/* Category Divider */}
      <section id="how-it-works-section" className="w-full py-32 px-6 border-t-4 border-primary relative z-10 bg-[#E4E2DD]">
        <div className="max-w-7xl mx-auto flex flex-col gap-24">
          <div className="flex justify-between items-start">
            <motion.h2 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, type: "spring" }}
              className="text-[10vw] font-heading font-bold uppercase tracking-tighter leading-none text-primary/95 select-none"
            >
              HOW IT WORKS
            </motion.h2>
            <motion.span 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="font-heading text-lg text-accent-red font-bold uppercase tracking-widest pt-4"
            >
              [ PROTOCOL ]
            </motion.span>
          </div>

          {/* Animated Line */}
          <div className="relative w-full h-[2px] bg-primary/20 overflow-hidden">
            <motion.div 
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{ originX: 0 }}
              className="absolute inset-0 bg-primary"
                />
          </div>

          {/* 4 Step Process Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-10">
            
            <motion.div 
              custom={0}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="flex flex-col gap-6 border-2 border-primary p-6 bg-[#eae8e3]/60 backdrop-blur-sm shadow-[4px_4px_0px_0px_#1E1E1E] hover:shadow-[8px_8px_0px_0px_#1E1E1E] hover:-translate-y-1.5 transition-all duration-300"
            >
              <span className="font-heading text-4xl text-accent-red">01</span>
              <h3 className="font-heading text-xl font-bold tracking-tight">ACCESS</h3>
              <p className="text-sm font-medium opacity-75 leading-relaxed">
                Configure your credential token. Create your user account to initialize your personal tracking matrix.
              </p>
            </motion.div>

            <motion.div 
              custom={1}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="flex flex-col gap-6 border-2 border-primary p-6 bg-[#eae8e3]/60 backdrop-blur-sm shadow-[4px_4px_0px_0px_#1E1E1E] hover:shadow-[8px_8px_0px_0px_#1E1E1E] hover:-translate-y-1.5 transition-all duration-300"
            >
              <span className="font-heading text-4xl text-accent-orange">02</span>
              <h3 className="font-heading text-xl font-bold tracking-tight">LOG MEALS</h3>
              <p className="text-sm font-medium opacity-75 leading-relaxed">
                Describe your food log in natural language. Type what you ate without parsing columns or portions manually.
              </p>
            </motion.div>

            <motion.div 
              custom={2}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="flex flex-col gap-6 border-2 border-primary p-6 bg-[#eae8e3]/60 backdrop-blur-sm shadow-[4px_4px_0px_0px_#1E1E1E] hover:shadow-[8px_8px_0px_0px_#1E1E1E] hover:-translate-y-1.5 transition-all duration-300"
            >
              <span className="font-heading text-4xl text-accent-pink">03</span>
              <h3 className="font-heading text-xl font-bold tracking-tight">ANALYSIS</h3>
              <p className="text-sm font-medium opacity-75 leading-relaxed">
                The engine breaks down total calories, protein, carbs, fats, and fiber, evaluating biological markers.
              </p>
            </motion.div>

            <motion.div 
              custom={3}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="flex flex-col gap-6 border-2 border-primary p-6 bg-[#eae8e3]/60 backdrop-blur-sm shadow-[4px_4px_0px_0px_#1E1E1E] hover:shadow-[8px_8px_0px_0px_#1E1E1E] hover:-translate-y-1.5 transition-all duration-300"
            >
              <span className="font-heading text-4xl text-primary">04</span>
              <h3 className="font-heading text-xl font-bold tracking-tight">OPTIMIZE</h3>
              <p className="text-sm font-medium opacity-75 leading-relaxed">
                Receive specific deficiency warnings and personalized recommendations to restore system balance.
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Campaign Connect Block */}
      <section className="w-full bg-[#D9D6D0] py-32 px-6 border-t-4 border-primary relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 w-full">
          
          {/* Left Column - Large Editorial Header */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <motion.h2 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-[6vw] font-heading font-bold uppercase tracking-tighter leading-none select-none"
            >
              CONNECT WITH THE ARCHITECT
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg font-medium opacity-80 max-w-md mt-8 leading-relaxed"
            >
              Reach out to discuss system optimizations, technical features, or collaboration.
            </motion.p>
          </div>

          {/* Right Column - Contact Stack */}
          <motion.div 
            variants={socialContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="lg:col-span-5 flex flex-col justify-center gap-6 border-l-2 border-primary pl-0 lg:pl-12"
          >
            <motion.div variants={socialItemVariants}>
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
            </motion.div>

            <motion.div variants={socialItemVariants}>
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
            </motion.div>

            <motion.div variants={socialItemVariants}>
              <SocialLink 
                href="mailto:daspranajit973@gmail.com"
                label="Email"
                value="daspranajit973@gmail.com"
                brandColor="#FF89A9"
                icon={<Mail className="w-6 h-6" />}
              />
            </motion.div>

          </motion.div>
        </div>
      </section>

    </PageTransition>
  );
};

export default HeroPage;
