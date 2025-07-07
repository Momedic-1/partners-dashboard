"use client";

import { baseUrl } from "@/env";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useState, useEffect } from "react";

// Utility to check if JWT token is expired
const isTokenExpired = (token: string): boolean => {
  try {
    const [, payload] = token.split(".");
    const decoded = JSON.parse(atob(payload));
    const exp = decoded.exp;
    return Date.now() >= exp * 1000; // exp is in seconds, convert to ms
  } catch {
    return true;
  }
};

export interface User {
  id: string;
  organizationId?: number;
  email: string;
  name: string;
  [key: string]: any;
}

export interface AuthContextType {
  token: string | null;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const response = await axios.post(`${baseUrl}/api/organization/login`, {
        email,
        password,
      });

      const { token, orgAdminLoginDto } = response.data;

      const userData: User = {
        id: orgAdminLoginDto.id,
        organizationId: orgAdminLoginDto.organizationId,
        email: orgAdminLoginDto.email,
        name: orgAdminLoginDto.name,
      };

      setToken(token);
      setUser(userData);

      localStorage.setItem("authToken", token);
      localStorage.setItem("userData", JSON.stringify(userData));

      return userData;
    } catch (error: any) {
      console.error("Login failed:", error);
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    router.push("/auth/login");
  };

  // On mount, initialize token and user from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("userData");

    if (storedToken && isTokenExpired(storedToken)) {
      logout(); // Expired token, force logout
      return;
    }

    if (storedToken) setToken(storedToken);
    if (storedUser) setUser(JSON.parse(storedUser));

    setLoading(false);
  }, []);

  // Periodically check if token is expired
  useEffect(() => {
    const interval = setInterval(() => {
      if (token && isTokenExpired(token)) {
        logout();
      }
    }, 60 * 1000); // Check every 1 minute

    return () => clearInterval(interval);
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
