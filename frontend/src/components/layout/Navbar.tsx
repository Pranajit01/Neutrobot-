import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, LogIn, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const { token, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 mix-blend-difference sm:mix-blend-normal">
        <div className="w-1/3 flex justify-start">
          <Link to="/" className="font-heading font-bold text-2xl tracking-tighter sm:text-primary text-background mix-blend-difference sm:mix-blend-normal hover:text-accent-red transition-colors">
            NUTROBOT
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="w-1/3 hidden sm:flex justify-center gap-8 font-heading uppercase text-sm font-bold tracking-wider text-primary">
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

        <div className="w-1/3 flex justify-end gap-6 sm:text-primary text-background mix-blend-difference sm:mix-blend-normal items-center">
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
            className="sm:hidden text-background mix-blend-difference hover:text-accent-red transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
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
