import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { BackgroundBlobs } from './components/layout/BackgroundBlobs';

import HeroPage from './pages/HeroPage';
import DashboardPage from './pages/DashboardPage';
import FoodLogPage from './pages/FoodLogPage';
import HistoryPage from './pages/HistoryPage';
import AuthPage from './pages/AuthPage';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProfilePage = () => {
  const { user, updateProfile, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMsg('');
    try {
      await updateProfile(name);
      setStatusMsg('Changes saved successfully');
    } catch (err: any) {
      setStatusMsg(err.message || 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="pt-32 pb-24 px-6 min-h-screen max-w-3xl mx-auto relative z-10">
      <h1 className="text-6xl sm:text-8xl mb-16 border-b-4 border-primary pb-8">PROFILE</h1>
      
      {statusMsg && (
        <div className="bg-accent-orange text-background font-bold px-4 py-3 mb-8 uppercase text-sm tracking-wider">
          {statusMsg}
        </div>
      )}

      <form onSubmit={handleSave} className="flex flex-col gap-12 text-2xl font-medium">
        <div>
          <label className="text-sm opacity-50 uppercase tracking-widest block mb-4">Name</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="w-full bg-transparent border-b-2 border-primary outline-none py-2 focus:border-accent-red" 
          />
        </div>
        <div>
          <label className="text-sm opacity-50 uppercase tracking-widest block mb-4">Email</label>
          <input 
            type="email" 
            readOnly 
            value={user?.email || ''} 
            className="w-full bg-transparent border-b-2 border-primary outline-none py-2 opacity-50 cursor-not-allowed" 
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-6 mt-8">
          <button 
            type="submit" 
            disabled={isSaving}
            className="bg-primary text-background font-heading font-bold uppercase px-8 py-4 hover:bg-accent-red transition-colors"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
          
          <button 
            type="button" 
            onClick={logout}
            className="border-2 border-primary text-primary font-heading font-bold uppercase px-8 py-4 hover:bg-accent-red hover:text-white transition-colors"
          >
            Sign Out
          </button>
        </div>
      </form>
    </div>
  );
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token, isLoading } = useAuth();
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center font-heading text-4xl">LOADING SYSTEM...</div>;
  }
  if (!token) {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
};

const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { token, isLoading } = useAuth();
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center font-heading text-4xl">LOADING SYSTEM...</div>;
  }
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HeroPage />} />
        <Route path="/auth" element={
          <AuthRoute>
            <AuthPage />
          </AuthRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/log" element={
          <ProtectedRoute>
            <FoodLogPage />
          </ProtectedRoute>
        } />
        <Route path="/history" element={
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <BackgroundBlobs />
        <Navbar />
        <AnimatedRoutes />
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
