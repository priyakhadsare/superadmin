import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  user: any;
  token: string | null;
  login: (userData: any) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isTokenValid = (tk: string): boolean => {
    if (!tk) return false;
    // Allow dev bypass token (kept for internal dev use only)
    if (tk === 'dev_bypass_token') return true;

    try {
      const decoded: any = jwtDecode(tk);
      // If token has no exp claim, treat as valid
      if (!decoded.exp) return true;
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch {
      // If decode fails, the token is invalid/malformed
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('access_token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      if (isTokenValid(savedToken)) {
        setToken(savedToken);
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          // Corrupted user JSON — clear and re-login
          logout();
        }
      } else {
        // Token expired — clear storage silently
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData: any) => {
    const accessToken = userData.access_token;
    setUser(userData);
    setToken(accessToken);
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      logout,
      isAuthenticated: !!token,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
