import { useState, useEffect, createContext, useContext } from "react";
import { apiClient } from "@/api/client";

const AuthContext = createContext({
  user: null,
  loading: true,
  signOut: async () => {},
  login: async () => {},
  register: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token and validate user
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const response = await apiClient.getProfile();
          setUser(response.user);
        } catch (error) {
          console.error('Auth check failed:', error);
          // Clear invalid token
          localStorage.removeItem('accessToken');
          apiClient.setToken(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const response = await apiClient.login({ email, password });
    setUser(response.user);
  };

  const register = async (email, password, fullName) => {
    const response = await apiClient.register({ email, password, fullName });
    setUser(response.user);
  };

  const signOut = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      apiClient.setToken(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, login, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};