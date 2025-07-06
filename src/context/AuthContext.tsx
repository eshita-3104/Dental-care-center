import { createContext, useState, useEffect, type ReactNode } from 'react';
import { initializeDatabase } from '../api/db';
import { loginUser } from '../api/auth';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        await initializeDatabase();

        const stored = sessionStorage.getItem('authUser');
        if (stored) {
          setUser(JSON.parse(stored));
        }
      } catch (err) {
        console.error('Auth bootstrap failed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const loggedIn = await loginUser(email, password);
      if (loggedIn) {
        const { password, ...safeUser } = loggedIn;
        setUser(safeUser);
        sessionStorage.setItem('authUser', JSON.stringify(safeUser));
        return true;
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('authUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
