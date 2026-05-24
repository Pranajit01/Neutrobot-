import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { PageTransition } from '../components/layout/PageTransition';
import { Button } from '../components/ui/Button';

export const AuthPage: React.FC = () => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
      // Redirect or success handled by AuthContext trigger
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition className="pt-32 pb-24 px-6 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-lg border-4 border-primary p-8 sm:p-12 bg-transparent relative z-10">
        <h1 className="text-5xl sm:text-6xl font-heading mb-12 tracking-tighter leading-none">
          {isLogin ? 'ACCESS' : 'REGISTER'}
          <span className="block text-accent-red">NUTROBOT</span>
        </h1>

        {error && (
          <div className="bg-accent-red text-background font-bold px-4 py-3 mb-8 uppercase text-sm tracking-wider">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {!isLogin && (
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest opacity-50 font-bold">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="YOUR NAME"
                className="w-full bg-transparent border-b-2 border-primary outline-none py-2 text-xl font-medium focus:border-accent-red transition-colors placeholder-primary/20"
              />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest opacity-50 font-bold">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="EMAIL@EXAMPLE.COM"
              className="w-full bg-transparent border-b-2 border-primary outline-none py-2 text-xl font-medium focus:border-accent-red transition-colors placeholder-primary/20"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest opacity-50 font-bold">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-transparent border-b-2 border-primary outline-none py-2 text-xl font-medium focus:border-accent-red transition-colors placeholder-primary/20"
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="mt-6 w-full">
            {isSubmitting ? 'PROCESSING...' : isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t-2 border-primary/20 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
            }}
            className="text-sm font-heading font-bold uppercase tracking-wider text-accent-orange hover:text-accent-red transition-colors"
          >
            {isLogin ? 'Create a new account instead' : 'Already have an account? Sign In'}
          </button>
        </div>
      </div>
    </PageTransition>
  );
};

export default AuthPage;
