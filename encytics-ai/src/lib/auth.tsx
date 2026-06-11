// Role-based auth provider for the content workflow.
//
// IMPORTANT: this is a CLIENT-SIDE role gate intended for "now" — it keeps the
// session in localStorage and checks credentials defined below. It is NOT real
// security (anyone can read frontend code). It exists so the editor/admin
// workflow is fully functional today. To productionize, replace login() with a
// call to a real auth backend (e.g. Supabase Auth, Auth0, Clerk) and have it
// return the { email, name, role } user — the rest of the app stays the same.
//
// The context, useAuth hook, and hasRole helper live in ./authContext.

import { useState, useCallback, type ReactNode } from "react";
import type { User } from "./types";
import { AuthContext } from "./authContext";

const SESSION_KEY = "encytics.session.v1";

// Demo accounts. Replace with real auth before going live.
interface Account extends User {
  password: string;
}
const accounts: Account[] = [
  { email: "admin@encytics.ai", password: "admin123", name: "Site Admin", role: "admin" },
  { email: "editor@encytics.ai", password: "editor123", name: "Content Editor", role: "editor" },
];

function loadSession(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(loadSession);

  const login = useCallback((email: string, password: string) => {
    const match = accounts.find(
      (a) => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password
    );
    if (!match) return { ok: false, error: "Invalid email or password." };
    const u: User = { email: match.email, name: match.name, role: match.role };
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(u));
    } catch {
      /* ignore storage failure */
    }
    setUser(u);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin: user?.role === "admin" }}>
      {children}
    </AuthContext.Provider>
  );
}
