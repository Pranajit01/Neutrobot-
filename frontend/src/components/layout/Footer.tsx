import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { token } = useAuth();

  return (
    <footer className="bg-primary text-background relative overflow-hidden pt-24 pb-12 px-6 mt-24">
      <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="flex flex-col gap-4">
          <span className="font-heading font-bold text-2xl tracking-tighter">NUTROBOT</span>
          <p className="text-sm max-w-xs opacity-70">
            Premium AI-powered Nutrition & Wellness Platform with a Swiss Brutalist aesthetic.
          </p>
        </div>
        
        <div className="flex gap-16 font-heading uppercase text-sm font-bold tracking-wider">
          <div className="flex flex-col gap-4">
            <span className="text-accent-orange opacity-50 mb-2">Platform</span>
            {token ? (
              <>
                <Link to="/dashboard" className="hover:text-accent-red transition-colors">Dashboard</Link>
                <Link to="/log" className="hover:text-accent-red transition-colors">Food Log</Link>
                <Link to="/history" className="hover:text-accent-red transition-colors">History</Link>
              </>
            ) : (
              <>
                <Link to="/auth" className="hover:text-accent-red transition-colors">Sign In / Join</Link>
              </>
            )}
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-accent-pink opacity-50 mb-2">Connect</span>
            <a href="https://www.linkedin.com/in/pranajit-ai" target="_blank" rel="noopener noreferrer" className="hover:text-accent-red transition-colors">LinkedIn</a>
            <a href="https://instagram.com/eccentric_pj" target="_blank" rel="noopener noreferrer" className="hover:text-accent-red transition-colors">Instagram</a>
            <a href="mailto:daspranajit973@gmail.com" className="hover:text-accent-red transition-colors">Email</a>
          </div>
        </div>
      </div>
      
      {/* Huge background year typography */}
      <div className="absolute bottom-[-10%] left-0 right-0 text-center select-none pointer-events-none opacity-5">
        <span className="font-heading font-bold text-[35vw] leading-none tracking-tighter">
          {currentYear}
        </span>
      </div>
    </footer>
  );
};
