"use client";

import { baseUrl } from "@/env";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const isTokenExpired = (token: string): boolean => {
  try {
    const [, payload] = token.split(".");
    const decoded = JSON.parse(atob(payload));
    return Date.now() >= decoded.exp * 1000;
  } catch {
    return true;
  }
};

export interface User {
  id: string;
  organizationId: number;
  email: string;
  name: string;
  role?: string;
  mustChangePassword?: boolean;
  [key: string]: unknown;
}

export interface AuthContextType {
  token: string | null;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  refreshUserFromStorage: () => void;
  setMustChangePassword: (value: boolean) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const persistSession = (authToken: string, userData: User) => {
    setToken(authToken);
    setUser(userData);
    localStorage.setItem("authToken", authToken);
    localStorage.setItem("userData", JSON.stringify(userData));
  };

  const login = async (email: string, password: string): Promise<User> => {
    const response = await axios.post(`${baseUrl}/api/organization/login`, {
      email,
      password,
    });

    const { token: authToken, orgAdminLoginDto } = response.data;

    // Production API may not send organizationId yet — match live portal behaviour
    // (use admin account id for org-scoped routes until backend is updated).
    const organizationId =
      orgAdminLoginDto.organizationId != null
        ? Number(orgAdminLoginDto.organizationId)
        : Number(orgAdminLoginDto.id);

    const userData: User = {
      id: String(orgAdminLoginDto.id),
      organizationId,
      email: orgAdminLoginDto.email,
      name: orgAdminLoginDto.name,
      role: orgAdminLoginDto.role,
      // Only force password change when API explicitly requests it (new partners).
      mustChangePassword: orgAdminLoginDto.mustChangePassword === true,
    };

    persistSession(authToken, userData);
    return userData;
  };

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    router.push("/auth/login");
  }, [router]);

  const refreshUserFromStorage = () => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) setUser(JSON.parse(storedUser));
  };

  const setMustChangePassword = (value: boolean) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, mustChangePassword: value };
      localStorage.setItem("userData", JSON.stringify(next));
      return next;
    });
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("userData");

    if (storedToken && isTokenExpired(storedToken)) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      setLoading(false);
      return;
    }

    if (storedToken) setToken(storedToken);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("userData");
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (token && isTokenExpired(token)) logout();
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, [token, logout]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        login,
        logout,
        refreshUserFromStorage,
        setMustChangePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
