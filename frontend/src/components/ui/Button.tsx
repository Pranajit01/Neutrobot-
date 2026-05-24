import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', children, className = '', ...props }, ref) => {
    if (variant === 'secondary') {
      return (
        <button
          ref={ref}
          className={`group flex items-center gap-2 font-heading font-bold uppercase text-primary hover:text-accent-red transition-colors duration-300 ${className}`}
          {...props}
        >
          {children}
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      );
    }

    return (
      <button
        ref={ref}
        className={`relative overflow-hidden bg-primary text-background font-heading font-bold uppercase px-8 py-4 group ${className}`}
        {...props}
      >
        <span className="relative z-10 group-hover:text-accent-red transition-colors duration-300">
          {children}
        </span>
        <div className="absolute inset-0 bg-white translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-out origin-left" />
      </button>
    );
  }
);

Button.displayName = 'Button';
