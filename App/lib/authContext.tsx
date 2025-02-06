"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

const AuthContext = createContext<{
  accessToken: string | null;
  login: (token: string) => void;
  logout: () => void;
}>({
  accessToken: null,
  login: (token: string) => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // check for an existing token in sessionStorage on initial load
  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      setAccessToken(token);
    }
  }, []);

  const login = (token: any) => {
    sessionStorage.setItem("accessToken", token); // Save token to sessionStorage
    setAccessToken(token); // Update state
  };

  const logout = () => {
    sessionStorage.removeItem("accessToken"); // Remove token from sessionStorage
    setAccessToken(null); // Clear state
  };

  return (
    <AuthContext.Provider value={{ accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);

