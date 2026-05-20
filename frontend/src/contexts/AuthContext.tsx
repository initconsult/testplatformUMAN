"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  username: string;
  email: string;
  is_admin: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = async (token: string) => {
    console.log("AuthContext: Fetching user with token...");
    try {
      const response = await fetch("https://testplatform-uman-acc.initconsult.be/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        console.log("AuthContext: User data received:", userData);
        setUser(userData);
      } else {
        console.warn("AuthContext: Fetch user failed with status:", response.status);
        localStorage.removeItem("access_token");
        localStorage.removeItem("token_type");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      localStorage.removeItem("access_token");
      localStorage.removeItem("token_type");
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        await fetchUser(token);
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (token: string) => {
    setLoading(true);
    localStorage.setItem("access_token", token);
    await fetchUser(token);
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("token_type");
    setUser(null);
    router.push("/admin/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
