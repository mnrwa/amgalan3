"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { UserType, LoginCredentials, RegisterCredentials } from "../types";
import { authApi } from "../lib/api";

interface AuthContextType {
  user: UserType | null;
  login: (cred: LoginCredentials) => Promise<void>;
  register: (cred: RegisterCredentials) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { checkAuth(); }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const { user } = await authApi.getMe(token);
        setUser(user);
      } catch { localStorage.removeItem("token"); }
    }
    setLoading(false);
  };

  const login = async (cred: LoginCredentials) => {
    const { user, token } = await authApi.login(cred);
    localStorage.setItem("token", token);
    setUser(user);
  };

  const register = async (cred: RegisterCredentials) => {
    const { user, token } = await authApi.register(cred);
    localStorage.setItem("token", token);
    setUser(user);
  };

  const logout = () => { localStorage.removeItem("token"); setUser(null); };

  return <AuthContext.Provider value={{ user, login, register, logout, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
