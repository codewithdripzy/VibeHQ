"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useRouter } from "next/navigation";
import authService, { User } from "@/services/auth.service";
import { ApiError } from "@/services/api.service";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  loginWithGithub: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const clearError = useCallback(() => setError(null), []);

  useEffect(() => {
    const init = async () => {
      if (!authService.isAuthenticated()) {
        setLoading(false);
        return;
      }
      try {
        const { user } = await authService.getSession();
        setUser(user);
      } catch {
        authService.logout();
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleAuth = async (promise: Promise<{ user: User }>) => {
    try {
      setError(null);
      setLoading(true);
      const { user } = await promise;
      setUser(user);
      router.push("/dashboard");
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = (email: string, password: string) =>
    handleAuth(authService.login(email, password));

  const register = (firstName: string, lastName: string, email: string, password: string) =>
    handleAuth(authService.register(firstName, lastName, email, password));

  const loginWithGoogle = (idToken: string) =>
    handleAuth(authService.continueWithGoogle(idToken));

  const loginWithGithub = (idToken: string) =>
    handleAuth(authService.continueWithGithub(idToken));

  const logout = async () => {
    await authService.logout();
    setUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, loginWithGoogle, loginWithGithub, logout, error, clearError }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
