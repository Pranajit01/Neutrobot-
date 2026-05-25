import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', children, className = '', ...props }, ref) => {
    if (variant === 'secondary') {
      return (
        <motion.button
          ref={ref as any}
          whileHover={{ scale: 1.02, x: 3 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          className={`group flex items-center gap-2 font-heading font-bold uppercase text-primary hover:text-accent-red transition-colors duration-300 ${className}`}
          {...props as any}
        >
          {children}
          <motion.span
            variants={{
              initial: { x: 0 },
              hover: { x: 5 }
            }}
            initial="initial"
            whileHover="hover"
            transition={{ type: 'spring', stiffness: 300, damping: 12 }}
          >
            <ArrowRight className="w-5 h-5 group-hover:text-accent-red" />
          </motion.span>
        </motion.button>
      );
    }

    return (
      <motion.button
        ref={ref as any}
        whileHover={{ 
          y: -4, 
          scale: 1.02,
          boxShadow: '0px 12px 24px -4px rgba(219, 74, 43, 0.45), 0px 4px 6px -2px rgba(219, 74, 43, 0.2)',
        }}
        whileTap={{ 
          y: 1, 
          scale: 0.98,
          boxShadow: '0px 4px 6px -2px rgba(219, 74, 43, 0.3)',
        }}
        transition={{ type: 'spring', stiffness: 450, damping: 14 }}
        style={{
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.08) 49%, rgba(0, 0, 0, 0.05) 50%, rgba(0, 0, 0, 0.18) 100%), #DB4A2B'
        }}
        className={`relative overflow-hidden text-white font-heading font-bold uppercase px-8 py-4 border border-white/30 rounded-none shadow-[inset_0_1.5px_2.5px_rgba(255,255,255,0.55),_inset_0_-1.5px_1.5px_rgba(0,0,0,0.25),_0_8px_16px_-4px_rgba(219,74,43,0.3)] group ${className}`}
        {...props as any}
      >
        {/* Apple Gloss Gel Upper Highlight */}
        <div className="absolute inset-x-0 top-0 h-[48%] bg-gradient-to-b from-white/25 to-transparent pointer-events-none z-10" />

        {/* Diagonal Sweeping Sheen Reflection (Tailwind group-hover) */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent -skew-x-12 translate-x-[-150%] group-hover:translate-x-[250%] transition-transform duration-[1000ms] ease-in-out pointer-events-none z-20" />

        {/* Text */}
        <span className="relative z-30 block drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)] tracking-wide">
          {children}
        </span>
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
