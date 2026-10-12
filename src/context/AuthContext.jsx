import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.get('/auth/me')
        .then((res) => {
          if (res.success) {
            setUser(res.data);
            localStorage.setItem('user', JSON.stringify(res.data));
          }
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.success && res.data.token) {
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      // Fetch full me profile
      const meRes = await api.get('/auth/me');
      if (meRes.success) {
        setUser(meRes.data);
        localStorage.setItem('user', JSON.stringify(meRes.data));
        return meRes.data;
      }
    }
    return res;
  };

  const register = async (data) => {
    const res = await api.post('/auth/register', data);
    if (res.success && res.data.token) {
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      const meRes = await api.get('/auth/me');
      if (meRes.success) {
        setUser(meRes.data);
        localStorage.setItem('user', JSON.stringify(meRes.data));
        return meRes.data;
      }
    }
    return res;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
