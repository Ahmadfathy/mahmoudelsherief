import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

// نظام تسجيل دخول شكلي (mock) لحد ما يتحط backend حقيقي (Supabase/Firebase)
// كل البيانات دي بتتخزن في localStorage بس، مفيش أي تحقق حقيقي من السيرفر

export type AuthUser = {
  name: string;
  avatarUrl?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isSubscribed: boolean;
  login: (name: string) => void;
  logout: () => void;
  toggleSubscription: () => void;
};

const STORAGE_KEY = "academy-auth";

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredAuth(): { user: AuthUser | null; isSubscribed: boolean } {
  if (typeof window === "undefined") return { user: null, isSubscribed: false };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { user: null, isSubscribed: false };
    return JSON.parse(raw);
  } catch {
    return { user: null, isSubscribed: false };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const stored = readStoredAuth();
    setUser(stored.user);
    setIsSubscribed(stored.isSubscribed);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, isSubscribed }));
  }, [user, isSubscribed]);

  function login(name: string) {
    setUser({ name });
    setIsSubscribed(true);
  }

  function logout() {
    setUser(null);
    setIsSubscribed(false);
  }

  function toggleSubscription() {
    setIsSubscribed((s) => !s);
  }

  return (
    <AuthContext.Provider value={{ user, isSubscribed, login, logout, toggleSubscription }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
