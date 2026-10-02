import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ApiError, apiRequest, getStudentToken, setStudentToken } from "@/lib/api";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "student" | "admin";
  status: "active" | "suspended";
  approvedCourseSlugs: string[];
};

export type LoginResult = "ok" | "invalid" | "suspended" | "error";

type RegisterInput = {
  name: string;
  email: string;
  phone: string;
  password: string;
  courseId?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  login: (phone: string, password: string) => Promise<LoginResult>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccess: () => Promise<void>;
  requestSubscription: (courseId: string, notes?: string) => Promise<void>;
  hasAccess: (courseSlug: string) => boolean;
};

type ApiUser = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  role: "student" | "admin";
  status: "active" | "suspended";
};

const AuthContext = createContext<AuthContextValue | null>(null);

function mapUser(user: ApiUser, approvedCourseSlugs: string[] = []): AuthUser {
  return {
    id: String(user.id),
    name: user.name,
    email: user.email,
    phone: user.phone ?? "",
    role: user.role,
    status: user.status,
    approvedCourseSlugs,
  };
}

async function fetchApprovedSlugs(token: string) {
  const response = await apiRequest<{
    subscriptions: Array<{ course?: { slug?: string } }>;
  }>("/my-courses", { token });
  return response.subscriptions
    .map((subscription) => subscription.course?.slug)
    .filter((slug): slug is string => Boolean(slug));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const restoreSession = useCallback(async () => {
    const token = getStudentToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await apiRequest<{ user: ApiUser }>("/me", { token });
      const slugs = response.user.role === "student" ? await fetchApprovedSlugs(token) : [];
      setUser(mapUser(response.user, slugs));
    } catch {
      setStudentToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void restoreSession();
  }, [restoreSession]);

  async function login(phone: string, password: string): Promise<LoginResult> {
    try {
      const response = await apiRequest<{ user: ApiUser; token: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ phone, password, device_name: "academy-web" }),
      });
      setStudentToken(response.token);
      const slugs = response.user.role === "student" ? await fetchApprovedSlugs(response.token) : [];
      setUser(mapUser(response.user, slugs));
      return "ok";
    } catch (error) {
      if (error instanceof ApiError && error.status === 422) return "invalid";
      if (error instanceof ApiError && error.status === 403) return "suspended";
      return "error";
    }
  }

  async function register(input: RegisterInput) {
    const response = await apiRequest<{ user: ApiUser; token: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: input.name,
        email: input.email,
        phone: input.phone || null,
        password: input.password,
        password_confirmation: input.password,
        device_name: "academy-web",
      }),
    });
    setStudentToken(response.token);
    setUser(mapUser(response.user));
    if (input.courseId) {
      await apiRequest("/subscriptions", {
        method: "POST",
        token: response.token,
        body: JSON.stringify({ course_id: Number(input.courseId) }),
      });
    }
  }

  async function refreshAccess() {
    const token = getStudentToken();
    if (!token || !user) return;
    const slugs = await fetchApprovedSlugs(token);
    setUser((current) => (current ? { ...current, approvedCourseSlugs: slugs } : current));
  }

  async function requestSubscription(courseId: string, notes?: string) {
    const token = getStudentToken();
    if (!token) throw new ApiError("يجب تسجيل الدخول أولًا.", 401);
    await apiRequest("/subscriptions", {
      method: "POST",
      token,
      body: JSON.stringify({ course_id: Number(courseId), notes: notes || null }),
    });
  }

  async function logout() {
    const token = getStudentToken();
    try {
      if (token) await apiRequest("/auth/logout", { method: "POST", token });
    } finally {
      setStudentToken(null);
      setUser(null);
    }
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      refreshAccess,
      requestSubscription,
      hasAccess: (courseSlug) => Boolean(user?.approvedCourseSlugs.includes(courseSlug)),
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
