import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, LogIn, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

export const Navbar: React.FC = () => {
  const { token, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      {/* Floating iOS-style Liquid Glass Navbar */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[92%] max-w-6xl z-50 rounded-full px-8 py-3.5 flex items-center justify-between bg-white/15 backdrop-blur-md border border-white/25 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.45),_inset_0_-1px_1px_rgba(0,0,0,0.1),_0_12px_24px_-4px_rgba(0,0,0,0.15)] overflow-hidden group">
        
        {/* Looping light reflection sweep (Liquid Glass effect) */}
        {!isMobile && (
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 pointer-events-none z-0"
            animate={{ translateX: ['-150%', '250%'] }}
            transition={{ 
              repeat: Infinity, 
              duration: 3, 
              repeatDelay: 5, 
              ease: "easeInOut" 
            }}
          />
        )}

        {/* Brand Logo (Left) */}
        <div className="w-1/3 flex justify-start relative z-10">
          <Link to="/" className="font-heading font-bold text-2xl tracking-tighter text-primary hover:text-accent-red transition-colors">
            NUTROBOT
          </Link>
        </div>
        
        {/* Desktop Navigation (Center) */}
        <div className="w-1/3 hidden sm:flex justify-center gap-8 font-heading uppercase text-sm font-bold tracking-wider text-primary relative z-10">
          {token ? (
            <>
              <Link to="/dashboard" className="hover:text-accent-red transition-colors">Dashboard</Link>
              <Link to="/log" className="hover:text-accent-red transition-colors">Log</Link>
              <Link to="/history" className="hover:text-accent-red transition-colors">History</Link>
            </>
          ) : (
            <>
              <Link to="/about" className="hover:text-accent-red transition-colors">About</Link>
              <Link to="/protocol" className="hover:text-accent-red transition-colors">Protocol</Link>
            </>
          )}
        </div>

        {/* User Profile / Action (Right) */}
        <div className="w-1/3 flex justify-end gap-6 text-primary items-center relative z-10">
          {/* Desktop User profile */}
          <div className="hidden sm:flex">
            {token ? (
              <Link to="/profile" className="hover:text-accent-red transition-colors">
                <User className="w-6 h-6" />
              </Link>
            ) : (
              <Link to="/auth" className="flex items-center gap-2 font-heading uppercase text-sm font-bold hover:text-accent-red transition-colors">
                <LogIn className="w-5 h-5" />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden text-primary hover:text-accent-red transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-[#E4E2DD] flex flex-col justify-center px-8 py-24 border-b-8 border-primary sm:hidden">
          <div className="flex flex-col gap-8 font-heading text-4xl uppercase font-bold tracking-tighter">
            {token ? (
              <>
                <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="hover:text-accent-red transition-colors">
                  Dashboard
                </Link>
                <Link to="/log" onClick={() => setMenuOpen(false)} className="hover:text-accent-red transition-colors">
                  Log Meal
                </Link>
                <Link to="/history" onClick={() => setMenuOpen(false)} className="hover:text-accent-red transition-colors">
                  Archive History
                </Link>
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="hover:text-accent-red transition-colors">
                  My Profile
                </Link>
                <button 
                  onClick={() => { setMenuOpen(false); logout(); }} 
                  className="text-left hover:text-accent-red transition-colors text-accent-orange font-heading font-bold uppercase"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/about" onClick={() => setMenuOpen(false)} className="hover:text-accent-red transition-colors">
                  About
                </Link>
                <Link to="/protocol" onClick={() => setMenuOpen(false)} className="hover:text-accent-red transition-colors">
                  Protocol
                </Link>
                <Link to="/auth" onClick={() => setMenuOpen(false)} className="hover:text-accent-red transition-colors text-accent-red">
                  Sign In / Join
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};
