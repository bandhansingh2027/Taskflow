import React, { createContext, useState, useEffect } from 'react';
import API from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('taskflow_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore user session if stored in localStorage
    const storedUser = localStorage.getItem('taskflow_user');
    const storedToken = localStorage.getItem('taskflow_token');
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (err) {
        console.error('Error parsing stored user:', err);
        localStorage.removeItem('taskflow_user');
        localStorage.removeItem('taskflow_token');
      }
    }
    setLoading(false);
  }, []);

  // Login handler
  const login = async (email, password) => {
    try {
      const response = await API.post('/auth/login', { email, password });
      const { token, _id, name, email: userEmail } = response.data;
      const userData = { _id, name, email: userEmail };

      localStorage.setItem('taskflow_token', token);
      localStorage.setItem('taskflow_user', JSON.stringify(userData));

      setToken(token);
      setUser(userData);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please check credentials.';
      return { success: false, message };
    }
  };

  // Register handler
  const register = async (name, email, password) => {
    try {
      const response = await API.post('/auth/register', { name, email, password });
      const { token, _id, name: userName, email: userEmail } = response.data;
      const userData = { _id, name: userName, email: userEmail };

      localStorage.setItem('taskflow_token', token);
      localStorage.setItem('taskflow_user', JSON.stringify(userData));

      setToken(token);
      setUser(userData);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      return { success: false, message };
    }
  };

  // Logout handler
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
