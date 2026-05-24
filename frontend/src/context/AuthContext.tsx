import React, { createContext, useState, useEffect, useContext } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateProfile: (name: string) => Promise<void>;
  authFetch: (url: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = 'http://localhost:5001/api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('nutrobot_token'));
  const [isLoading, setIsLoading] = useState(true);

  // Sync token changes to localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('nutrobot_token', token);
    } else {
      localStorage.removeItem('nutrobot_token');
      setUser(null);
    }
  }, [token]);

  // Fetch user profile if token exists on mount
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_URL}/user/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        } else {
          // Token expired or invalid
          setToken(null);
        }
      } catch (err) {
        console.error('Failed to load user profile:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, [token]);

  // Custom fetch wrapper that appends Auth header
  const authFetch = async (url: string, options: RequestInit = {}) => {
    const headers = {
      ...options.headers,
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
    
    const response = await fetch(url.startsWith('http') ? url : `${API_URL}${url}`, {
      ...options,
      headers
    });

    if (response.status === 401) {
      // Auto-logout on unauthorized
      setToken(null);
    }

    return response;
  };

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to login');
    }
    
    setToken(data.token);
    setUser(data.user);
  };

  const register = async (email: string, password: string, name: string) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    });
    
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to register');
    }
    
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (name: string) => {
    const res = await authFetch('/user/profile', {
      method: 'PUT',
      body: JSON.stringify({ name })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to update profile');
    }

    setUser(prev => prev ? { ...prev, name: data.name } : null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, updateProfile, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
