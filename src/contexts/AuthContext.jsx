import { createContext, useContext, useState, useCallback } from 'react';
import { loadUsers, loadAuth, saveAuth, clearAuth } from '../data/store.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = loadAuth();
    if (saved) {
      const users = loadUsers();
      return users.find(u => u.id === saved.userId) || null;
    }
    return null;
  });

  const login = useCallback((pin) => {
    const users = loadUsers();
    const user = users.find(u => u.pin === pin);
    if (user) {
      setCurrentUser(user);
      saveAuth({ userId: user.id });
      return { success: true, user };
    }
    return { success: false, error: 'PINが正しくありません' };
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    clearAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
