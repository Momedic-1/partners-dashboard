



"use client";

import { baseUrl } from "@/env";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useState, useEffect } from "react";


export interface User {
  id: string;
  organizationId: number;
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
  
      // Store token and user data
      setToken(token);
      setUser(userData);
      
      // Store in localStorage for persistence
      localStorage.setItem("authToken", token);
      localStorage.setItem("userData", JSON.stringify(userData));
      
      return userData;
    } catch (error: any) {
      console.error("Login failed:", error);
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  // Logout function
  const logout = () => {
    setToken(null);
    setUser(null);

    // Remove data from localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    
    // Redirect to login page
    router.push("/login");
  };

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("userData");
    
    if (storedToken) {
      setToken(storedToken);
    }
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;