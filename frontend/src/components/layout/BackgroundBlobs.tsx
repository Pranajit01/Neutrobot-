import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const BackgroundBlobs: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) {
    // Beautiful static radial gradient for mobile - zero performance cost, premium look
    return (
      <div 
        className="fixed inset-0 overflow-hidden pointer-events-none -z-10 opacity-70" 
        style={{
          background: `
            radial-gradient(circle at 15% 15%, rgba(219, 74, 43, 0.25) 0%, transparent 60%),
            radial-gradient(circle at 85% 85%, rgba(248, 163, 72, 0.25) 0%, transparent 60%)
          `
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      <motion.div
        className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full mix-blend-multiply filter blur-[140px] opacity-70"
        style={{ backgroundColor: '#DB4A2B' }}
        animate={{
          x: ['0%', '10%', '-5%', '0%'],
          y: ['0%', '-10%', '5%', '0%'],
          scale: [1, 1.05, 0.95, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full mix-blend-multiply filter blur-[140px] opacity-70"
        style={{ backgroundColor: '#F8A348' }}
        animate={{
          x: ['0%', '-10%', '10%', '0%'],
          y: ['0%', '5%', '-5%', '0%'],
          scale: [1, 0.95, 1.05, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
};

