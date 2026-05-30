import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { adminApi, setAuthToken } from '../services/api';

const AdminContext = createContext(null);

const readStored = (key) => {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const AdminProvider = ({ children }) => {
  const [token, setToken] = useState(() => sessionStorage.getItem('admin_token'));
  const [adminUser, setAdminUser] = useState(() => readStored('admin_user'));

  useEffect(() => {
    if (token) setAuthToken(token);
  }, [token]);

  const login = useCallback(async (email, password) => {
    const { data } = await adminApi.login(email, password);
    setToken(data.token);
    setAdminUser(data.admin);
    sessionStorage.setItem('admin_token', data.token);
    sessionStorage.setItem('admin_user', JSON.stringify(data.admin));
    setAuthToken(data.token);
    return data;
  }, []);

  const refreshProfile = useCallback(async () => {
    const { data } = await adminApi.getProfile();
    setAdminUser(data);
    sessionStorage.setItem('admin_user', JSON.stringify(data));
    return data;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setAdminUser(null);
    sessionStorage.removeItem('admin_token');
    sessionStorage.removeItem('admin_user');
    setAuthToken(null);
  }, []);

  const isAuthenticated = Boolean(token);

  return (
    <AdminContext.Provider
      value={{ token, adminUser, login, logout, refreshProfile, isAuthenticated }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin doit être utilisé dans AdminProvider');
  return ctx;
};
