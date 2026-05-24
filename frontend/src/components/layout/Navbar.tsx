import React from 'react';
import { Link } from 'react-router-dom';
import { User, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const { token } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 mix-blend-difference sm:mix-blend-normal">
      <div className="w-1/3 flex justify-start">
        <Link to="/" className="font-heading font-bold text-2xl tracking-tighter sm:text-primary text-background mix-blend-difference sm:mix-blend-normal hover:text-accent-red transition-colors">
          NUTROBOT
        </Link>
      </div>
      
      <div className="w-1/3 hidden sm:flex justify-center gap-8 font-heading uppercase text-sm font-bold tracking-wider text-primary">
        {token ? (
          <>
            <Link to="/dashboard" className="hover:text-accent-red transition-colors">Dashboard</Link>
            <Link to="/log" className="hover:text-accent-red transition-colors">Log</Link>
            <Link to="/history" className="hover:text-accent-red transition-colors">History</Link>
          </>
        ) : (
          <>
            <a href="#about" className="hover:text-accent-red transition-colors">About</a>
            <a href="#features" className="hover:text-accent-red transition-colors">Features</a>
          </>
        )}
      </div>

      <div className="w-1/3 flex justify-end gap-6 sm:text-primary text-background mix-blend-difference sm:mix-blend-normal">
        {token ? (
          <>
            <Link to="/profile" className="hover:text-accent-red transition-colors">
              <User className="w-6 h-6" />
            </Link>
          </>
        ) : (
          <Link to="/auth" className="flex items-center gap-2 font-heading uppercase text-sm font-bold hover:text-accent-red transition-colors">
            <LogIn className="w-5 h-5" />
            <span className="hidden sm:inline">Sign In</span>
          </Link>
        )}
      </div>
    </nav>
  );
};
