import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { readSubscribers } from "@/lib/subscribers-store";

// جلسة المشترك — localStorage (mock) لحد ما يتحط backend حقيقي بيتحقق من
// كلمة السر على السيرفر.

export type AuthUser = {
  name: string;
  email: string;
  approvedCourseSlugs: string[];
};

export type LoginResult = "ok" | "not-found" | "wrong-password" | "pending" | "rejected";

type AuthContextValue = {
  user: AuthUser | null;
  login: (email: string, password: string) => LoginResult;
  logout: () => void;
  hasAccess: (courseSlug: string) => boolean;
};

const STORAGE_KEY = "academy-auth";

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(readStoredUser());
  }, []);

  useEffect(() => {
    if (user) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  function login(email: string, password: string): LoginResult {
    const normalizedEmail = email.trim().toLowerCase();
    const record = readSubscribers().find((s) => s.email === normalizedEmail);

    if (!record) return "not-found";
    if (record.password !== password) return "wrong-password";
    if (record.status === "pending") return "pending";
    if (record.status === "rejected") return "rejected";

    setUser({
      name: record.name,
      email: record.email,
      approvedCourseSlugs: record.approvedCourseSlugs,
    });
    return "ok";
  }

  function logout() {
    setUser(null);
  }

  function hasAccess(courseSlug: string) {
    return !!user && user.approvedCourseSlugs.includes(courseSlug);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, hasAccess }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
