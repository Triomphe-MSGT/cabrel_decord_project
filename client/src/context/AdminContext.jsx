import { createContext, useContext, useState, useCallback } from 'react';
import { adminApi, setAuthToken } from '../services/api';

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  const login = useCallback(async (password) => {
    const { data } = await adminApi.login(password);
    setToken(data.token);
    setAuthToken(data.token);
    return data;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setAuthToken(null);
  }, []);

  const isAuthenticated = Boolean(token);

  return (
    <AdminContext.Provider value={{ token, login, logout, isAuthenticated }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin doit être utilisé dans AdminProvider');
  return ctx;
};
