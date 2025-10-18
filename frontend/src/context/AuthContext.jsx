/**
 * Authentication Context for managing user state globally.
 * Handles login, logout, registration, and token management.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // API base URL
  const API_URL = 'http://localhost:8000/api/auth';

  useEffect(() => {
    checkAuth();
  }, []);

  // Check if user is authenticated
  const checkAuth = async () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const response = await axios.get(`${API_URL}/user/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
      } catch (error) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    }
    setLoading(false);
  };

  // Register new user
  const register = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/register/`, userData);
      toast.success(response.data.message);
      return { success: true };
    } catch (error) {
      const errorMsg = error.response?.data?.username?.[0] || 
                       error.response?.data?.email?.[0] || 
                       'Registration failed';
      toast.error(errorMsg);
      return { success: false, error: error.response?.data };
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/login/`, credentials);
      const { access, refresh, user: userData } = response.data;
      
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      setUser(userData);
      
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Login failed';
      toast.error(errorMsg);
      return { success: false };
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    toast.success('Logged out successfully');
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await axios.patch(`${API_URL}/profile/`, profileData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      toast.success('Profile updated successfully');
      return { success: true };
    } catch (error) {
      const errorMsg = error.response?.data?.email?.[0] || 
                       error.response?.data?.username?.[0] || 
                       'Update failed';
      toast.error(errorMsg);
      return { success: false, error: error.response?.data };
    }
  };

  // Change password
  const changePassword = async (passwordData) => {
    const token = localStorage.getItem('accessToken');
    try {
      await axios.post(`${API_URL}/change-password/`, passwordData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Password changed successfully');
      return { success: true };
    } catch (error) {
      const errorMsg = error.response?.data?.old_password?.[0] || 
                       error.response?.data?.new_password?.[0] || 
                       'Password change failed';
      toast.error(errorMsg);
      return { success: false, error: error.response?.data };
    }
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};