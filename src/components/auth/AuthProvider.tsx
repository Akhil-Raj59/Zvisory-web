"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/lib/api";

export interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLoading: boolean;
  /** True if user role is ADMIN */
  isAdmin: boolean;
  /** True if user role is EMPLOYEE */
  isEmployee: boolean;
  /** True if user role is CUSTOMER */
  isCustomer: boolean;
  /** Log the user out from backend session, clear cookie, reset state, and redirect */
  logout: (redirectTo?: string) => Promise<void>;
  /** Re-fetch /api/auth/me to refresh user profile data from backend */
  refreshUser: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  initialUser = null,
  children,
}: {
  initialUser?: User | null;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(initialUser ?? null);
  const [prevInitialUser, setPrevInitialUser] = useState<User | null | undefined>(initialUser);
  const [isLoading, setIsLoading] = useState<boolean>(initialUser === undefined);

  // Synchronize state when initialUser changes from server without triggering effect cascades
  if (initialUser !== prevInitialUser) {
    setPrevInitialUser(initialUser);
    setUser(initialUser ?? null);
    setIsLoading(false);
  }

  const refreshUser = useCallback(async (): Promise<User | null> => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
          return data.user as User;
        }
      }
      setUser(null);
      return null;
    } catch {
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async (redirectTo = "/login") => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch {
      // Ignore network errors on logout to ensure client state resets
    } finally {
      setUser(null);
      router.push(redirectTo);
      router.refresh();
    }
  }, [router]);

  const role = user?.role?.toUpperCase();
  const isAdmin = role === "ADMIN";
  const isEmployee = role === "EMPLOYEE";
  const isCustomer = role === "CUSTOMER" || role === "CUSTUMER";

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoading,
        isAdmin,
        isEmployee,
        isCustomer,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Access the authenticated user context in client components.
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      setUser: () => {},
      isLoading: false,
      isAdmin: false,
      isEmployee: false,
      isCustomer: false,
      logout: async () => {},
      refreshUser: async () => null,
    };
  }
  return context;
}
