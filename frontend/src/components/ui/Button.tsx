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
          x: -4,
          boxShadow: '8px 8px 0px 0px #DB4A2B',
        }}
        whileTap={{ 
          y: 2, 
          x: 2,
          boxShadow: '2px 2px 0px 0px #DB4A2B',
          scale: 0.98
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 15 }}
        className={`relative overflow-hidden bg-primary text-background font-heading font-bold uppercase px-8 py-4 border-2 border-primary shadow-[4px_4px_0px_0px_#DB4A2B] group ${className}`}
        {...props as any}
      >
        <span className="relative z-10 block transition-colors duration-300">
          {children}
        </span>
        <div className="absolute inset-0 bg-white translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out origin-bottom" />
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
