import React, { createContext, useState, useEffect } from 'react';
import { defaultUser } from '../demo/demoData';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('taskflow_user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (err) {
        console.error('Error parsing stored user:', err);
      }
    }
    // Default demo session if none set
    return defaultUser;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('taskflow_token') || 'demo_jwt_token_taskflow_2026';
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Ensure default demo login session exists on app init
    if (!localStorage.getItem('taskflow_token')) {
      localStorage.setItem('taskflow_token', 'demo_jwt_token_taskflow_2026');
      localStorage.setItem('taskflow_user', JSON.stringify(defaultUser));
    }
  }, []);

  // Demo Login Handler
  const login = async (email, password) => {
    try {
      if (!email || !password) {
        return { success: false, message: 'Please provide both email and password.' };
      }

      const nameFromEmail = email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
      const userData = {
        _id: 'user_demo_101',
        name: email === 'demo@taskflow.com' ? 'Demo User' : nameFromEmail,
        email,
        role: 'Project Manager'
      };

      const demoToken = 'demo_jwt_token_taskflow_2026';

      localStorage.setItem('taskflow_token', demoToken);
      localStorage.setItem('taskflow_user', JSON.stringify(userData));

      setToken(demoToken);
      setUser(userData);
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Login failed. Please try again.' };
    }
  };

  // Demo Register Handler
  const register = async (name, email, password) => {
    try {
      if (!name || !email || !password) {
        return { success: false, message: 'Please fill in all required fields.' };
      }

      const userData = {
        _id: `user_demo_${Date.now()}`,
        name,
        email,
        role: 'Team Member'
      };

      const demoToken = 'demo_jwt_token_taskflow_2026';

      localStorage.setItem('taskflow_token', demoToken);
      localStorage.setItem('taskflow_user', JSON.stringify(userData));

      setToken(demoToken);
      setUser(userData);
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Registration failed. Please try again.' };
    }
  };

  // Demo Logout Handler
  const logout = () => {
    localStorage.removeItem('taskflow_token');
    localStorage.removeItem('taskflow_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
