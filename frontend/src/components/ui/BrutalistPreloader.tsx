import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface BrutalistPreloaderProps {
  onComplete: () => void;
}

export const BrutalistPreloader: React.FC<BrutalistPreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  // Smooth loading progress increment
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Random small increments to feel organic and smooth
        const increment = Math.floor(Math.random() * 4) + 1.5;
        return prev + increment > 100 ? 100 : prev + increment;
      });
    }, 25);

    return () => clearInterval(interval);
  }, []);

  // Complete preloader when progress is 100%
  useEffect(() => {
    if (progress === 100) {
      const timeout = setTimeout(() => {
        onComplete();
      }, 600); // Pause to let full fill transition settle
      return () => clearTimeout(timeout);
    }
  }, [progress, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        scale: 1.05,
        filter: "blur(10px)",
        transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] }
      }}
      className="fixed inset-0 z-[9999] bg-[#121212] flex items-center justify-center font-body p-6 overflow-hidden"
    >
      {/* Soft glowing colorful aura in background (Not completely black) */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        <motion.div 
          animate={{ 
            scale: [1, 1.15, 1],
            x: [-30, 30, -30],
            y: [-20, 20, -20]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-accent-red/40 blur-[130px]"
        />
        <motion.div 
          animate={{ 
            scale: [1.15, 1, 1.15],
            x: [30, -30, 30],
            y: [20, -20, 20]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-accent-pink/40 blur-[130px]"
        />
        <motion.div 
          animate={{ 
            scale: [0.9, 1.1, 0.9],
            x: [20, -20, 20],
            y: [-30, 30, -30]
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-accent-orange/20 blur-[150px]"
        />
      </div>

      {/* Grid Pattern overlay for retro tech theme */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-60" />

      <div className="relative flex flex-col items-center">
        {/* Brutalist Outline Board / Box */}
        <motion.div
          animate={{
            scale: progress === 100 ? [1, 1.03, 1] : 1,
            borderColor: progress === 100 ? '#DB4A2B' : 'rgba(255, 255, 255, 0.15)',
            boxShadow: progress === 100 
              ? '10px 10px 0px 0px #DB4A2B' 
              : '6px 6px 0px 0px rgba(255, 255, 255, 0.05)'
          }}
          transition={{ duration: 0.4 }}
          className="border-[3px] border-white/15 p-8 sm:p-12 bg-white/[0.01] backdrop-blur-sm relative overflow-hidden rounded-md min-w-[280px] sm:min-w-[450px] flex items-center justify-center"
        >
          {/* Background color fill inside the board */}
          <motion.div 
            className="absolute inset-0 bg-white/[0.04] z-0 origin-left"
            style={{ scaleX: progress / 100 }}
          />

          {/* Glowing bottom progress line */}
          <motion.div 
            className="absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-accent-red via-accent-orange to-accent-pink z-10"
            style={{ width: `${progress}%` }}
          />

          {/* Minimal display text with gradient clipping reveal */}
          <div className="relative z-10 font-heading text-5xl sm:text-7xl font-bold tracking-tighter select-none text-white/10 uppercase text-center w-full">
            NUTROBOT
            
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-accent-red via-accent-orange to-accent-pink bg-clip-text text-transparent origin-left uppercase text-center w-full"
              style={{ 
                clipPath: `inset(0 ${100 - progress}% 0 0)`
              }}
            />
          </div>
        </motion.div>

        {/* Minimal percentage text */}
        <div className="mt-6 font-heading text-sm text-white/30 tracking-widest uppercase">
          TELEMETRY LINKING: {Math.floor(progress)}%
        </div>
      </div>
    </motion.div>
  );
};

export default BrutalistPreloader;
