import React, { createContext, useState, useEffect } from 'react';
import { getCurrentUser, login as apiLogin, register as apiRegister } from '../api/authApi';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const userData = await getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error('Failed to authenticate on load', error);
          // Token might be invalid or expired, interceptor will try to refresh, 
          // if it fails it will clear tokens and redirect.
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const data = await apiLogin(credentials);
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      
      const userData = await getCurrentUser();
      setUser(userData);
      toast.success('Successfully logged in!');
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error', error);
      toast.error(error.response?.data?.detail || 'Failed to login. Please check your credentials.');
      return { success: false };
    }
  };

  const register = async (userData) => {
    try {
      await apiRegister(userData);
      toast.success('Registration successful! Logging you in...');
      return await login({ username: userData.username, password: userData.password });
    } catch (error) {
      console.error('Registration error', error);
      const errors = error.response?.data;
      if (errors) {
        const message = Object.values(errors).flat().join(' ');
        toast.error(message || 'Registration failed');
      } else {
        toast.error('Failed to register. Please try again.');
      }
      return { success: false };
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
