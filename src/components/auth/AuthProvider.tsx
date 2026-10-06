"use client";

import React, { createContext, useContext, useState } from "react";
import type { User } from "@/lib/api";

interface AuthContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  /** True if user role is ADMIN */
  isAdmin: boolean;
  /** True if user role is CUSTOMER */
  isCustomer: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  initialUser,
  children,
}: {
  initialUser: User;
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User>(initialUser);

  const isAdmin = user.role?.toUpperCase() === "ADMIN";
  const isCustomer = user.role?.toUpperCase() === "CUSTOMER";

  return (
    <AuthContext.Provider value={{ user, setUser, isAdmin, isCustomer }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Access the authenticated user context in client components within protected layouts.
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return context;
}
