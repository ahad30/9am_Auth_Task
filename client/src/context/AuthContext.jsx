import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
// import Cookies from 'js-cookie';

const AuthContext = createContext();
axios.defaults.baseURL = `${import.meta.env.VITE_BACKEND_URL}`;
axios.defaults.withCredentials = true;

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
  
  // Get token from localStorage or cookies
  const getToken = () => {
    return localStorage.getItem('token')
  };

  // Set token in both localStorage and cookies
  const setToken = (token , user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  };

  // Clear token from both storage methods
  const clearToken = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      if (!token) {
        setUser(null);
        return;
      }

    
      const response = await axios.get('/verify', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setUser(response.data.user);
        setToken(token , response.data.user);
      }
    } catch (error) {
      console.log('Not authenticated', error);
      clearToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      setLoading(true);
      const response = await axios.post('/signup', userData);
      
      if (response.data.success) {
        setUser(response.data.user);      
        toast.success('Account created successfully!');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Signup failed';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const signin = async (credentials) => {
    try {
      setLoading(true);
      const response = await axios.post('/signin', credentials);
      
      if (response?.data?.success) {
        setUser(response.data.user);
        if (response?.data?.user &&  response?.data?.user?.token) {
          setToken(response?.data?.user?.token , response?.data?.user);
        }
        toast.success('Login successful!');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post('/logout');
      clearToken();
      setUser(null);
      toast.success('Logged out successfully!');
    } catch (error) {
      console.error('Logout error:', error);
      clearToken();
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    signup,
    signin,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};