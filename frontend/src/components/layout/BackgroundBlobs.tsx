import React from 'react';
import { motion } from 'framer-motion';

export const BackgroundBlobs: React.FC = () => {
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
