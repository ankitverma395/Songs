import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(userData);
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, { email, password });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setToken(token);
    setUser(user);
    return response.data;
  };

  const signup = async (username, email, password) => {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, { username, email, password });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setToken(token);
    setUser(user);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};