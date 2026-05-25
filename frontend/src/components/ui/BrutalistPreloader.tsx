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
      }, 500); // Small pause at 100% to let the full gradient settle
      return () => clearTimeout(timeout);
    }
  }, [progress, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        y: '-100%',
        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
      }}
      className="fixed inset-0 z-[9999] bg-primary flex items-center justify-center font-body p-6"
    >
      <div className="relative flex flex-col items-center">
        {/* Minimal display text with gradient clipping reveal */}
        <div className="relative font-heading text-6xl sm:text-8xl font-bold tracking-tighter select-none text-white/5 uppercase">
          NUTROBOT
          
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-accent-red via-accent-orange to-accent-pink bg-clip-text text-transparent origin-left uppercase"
            style={{ 
              clipPath: `inset(0 ${100 - progress}% 0 0)`
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default BrutalistPreloader;
