import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface BrutalistPreloaderProps {
  onComplete: () => void;
}

const BOOT_MESSAGES = [
  'INITIALIZING BIO-METRIC MATRIX...',
  'CALIBRATING RECEPTORS & LIPIDS...',
  'ESTABLISHING DATABASE CONNECTION...',
  'CHECKING REDIS TELEMETRY...',
  'SYNCHRONIZING PRISMA CLIENT...',
  'TUNING SYSTEM BALANCE INDICATORS...',
  'READY.'
];

export const BrutalistPreloader: React.FC<BrutalistPreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  // Animate counter and messages
  useEffect(() => {
    // Speed up or slow down randomly to make it feel organic
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Random increment between 2 and 7
        const next = prev + Math.floor(Math.random() * 6) + 2;
        return next > 100 ? 100 : next;
      });
    }, 40);

    return () => clearInterval(interval);
  }, []);

  // Update messages based on progress
  useEffect(() => {
    const totalMessages = BOOT_MESSAGES.length;
    const currentStep = Math.min(
      Math.floor((progress / 100) * totalMessages),
      totalMessages - 1
    );
    setMessageIndex(currentStep);
  }, [progress]);

  // Wait a fraction of a second when 100% is reached to show "READY" before exiting
  useEffect(() => {
    if (progress === 100) {
      const timeout = setTimeout(() => {
        onComplete();
      }, 500);
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
      className="fixed inset-0 z-[9999] bg-primary text-background flex flex-col justify-between p-6 md:p-12 font-body"
    >
      {/* Top Header */}
      <div className="flex justify-between items-start font-heading text-xs md:text-sm tracking-widest opacity-60 uppercase border-b-2 border-background/25 pb-4">
        <div>SYSTEM: NUTROBOT // SECTOR_01</div>
        <div>STATUS: INITIALIZING_SYS_MATRIX</div>
      </div>

      {/* Middle Content */}
      <div className="flex flex-col items-center justify-center flex-grow py-12 relative">
        {/* Grid lines background (Brutalist style) */}
        <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 opacity-10 pointer-events-none">
          <div className="border-r border-b border-background"></div>
          <div className="border-r border-b border-background"></div>
          <div className="border-r border-b border-background"></div>
          <div className="border-b border-background"></div>
          <div className="border-r border-b border-background"></div>
          <div className="border-r border-b border-background"></div>
          <div className="border-r border-b border-background"></div>
          <div className="border-b border-background"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <h1 className="text-[20vw] md:text-[15vw] font-heading font-bold leading-none tracking-tighter text-accent-red select-none">
            {progress.toString().padStart(3, '0')}
          </h1>
          <motion.div 
            key={messageIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-sm md:text-lg tracking-widest uppercase mt-4 text-center text-accent-orange font-bold min-h-[28px]"
          >
            {BOOT_MESSAGES[messageIndex]}
          </motion.div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="flex flex-col gap-6">
        {/* Real Loading Bar */}
        <div className="h-6 w-full bg-background/10 border-2 border-background flex items-center p-0.5 relative overflow-hidden">
          <motion.div
            className="h-full bg-accent-red"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut' }}
          />
        </div>

        {/* Telemetry Status Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xxs md:text-xs font-heading tracking-widest uppercase border-t-2 border-background/25 pt-4">
          <div className="flex justify-between items-center opacity-65 border-r-0 md:border-r border-background/20 pr-0 md:pr-4">
            <span>DATABASE COGNITION</span>
            <span className={progress > 30 ? 'text-accent-orange font-bold' : 'opacity-40'}>
              {progress > 30 ? '[OK]' : '[...]'}
            </span>
          </div>
          <div className="flex justify-between items-center opacity-65 md:border-r border-background/20 px-0 md:px-4">
            <span>MEM_CACHE ENGINE</span>
            <span className={progress > 55 ? 'text-accent-pink font-bold' : 'opacity-40'}>
              {progress > 55 ? '[OK]' : '[...]'}
            </span>
          </div>
          <div className="flex justify-between items-center opacity-65 border-r-0 md:border-r border-background/20 px-0 md:px-4">
            <span>TOKEN DECRYPTION</span>
            <span className={progress > 75 ? 'text-accent-red font-bold' : 'opacity-40'}>
              {progress > 75 ? '[OK]' : '[...]'}
            </span>
          </div>
          <div className="flex justify-between items-center opacity-65 pl-0 md:pl-4">
            <span>BIO_TELEMETRY</span>
            <span className={progress === 100 ? 'text-green-400 font-bold' : 'opacity-40'}>
              {progress === 100 ? '[ONLINE]' : '[...]'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BrutalistPreloader;
