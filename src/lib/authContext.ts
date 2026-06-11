// Auth context, hook, and helpers. Kept separate from the provider component
// so the provider file is a clean fast-refresh boundary (component-only export).

import { createContext, useContext } from "react";
import type { Role, User } from "./types";

export interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

export function hasRole(user: User | null, role: Role): boolean {
  if (!user) return false;
  if (role === "editor") return user.role === "editor" || user.role === "admin";
  return user.role === "admin";
}
