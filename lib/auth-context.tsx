import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  ApiError,
  STUDENT_SESSION_EXPIRED_EVENT,
  apiRequest,
  getStudentToken,
  setStudentToken,
} from "@/lib/api";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "student" | "admin";
  status: "active" | "suspended";
  approvedCourseSlugs: string[];
};

export type LoginResult = "ok" | "invalid" | "admin_account" | "suspended" | "error";

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
  refreshProfile: () => Promise<void>;
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
  const [sessionExpired, setSessionExpired] = useState(false);
  const checkingSession = useRef(false);

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

  useEffect(() => {
    const expireSession = () => {
      setStudentToken(null);
      setUser(null);
      setSessionExpired(true);
    };

    window.addEventListener(STUDENT_SESSION_EXPIRED_EVENT, expireSession);
    return () => window.removeEventListener(STUDENT_SESSION_EXPIRED_EVENT, expireSession);
  }, []);

  useEffect(() => {
    if (!user || user.role !== "student") return;

    const verifySession = async () => {
      const token = getStudentToken();
      if (!token || checkingSession.current) return;

      checkingSession.current = true;
      try {
        await apiRequest("/me", { token });
      } catch (error) {
        // apiRequest emits the session-expired event for 401 responses. Network
        // errors are deliberately ignored so a temporary outage does not log out.
        if (!(error instanceof ApiError) || error.status !== 401) return;
      } finally {
        checkingSession.current = false;
      }
    };

    const interval = window.setInterval(() => void verifySession(), 25_000);
    const verifyWhenActive = () => {
      if (document.visibilityState === "visible") void verifySession();
    };
    window.addEventListener("focus", verifyWhenActive);
    document.addEventListener("visibilitychange", verifyWhenActive);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", verifyWhenActive);
      document.removeEventListener("visibilitychange", verifyWhenActive);
    };
  }, [user?.id, user?.role]);

  async function login(phone: string, password: string): Promise<LoginResult> {
    try {
      const response = await apiRequest<{ user: ApiUser; token: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ phone, password, device_name: "academy-web", login_as: "student" }),
      });
      if (response.user.role !== "student") {
        try {
          await apiRequest("/auth/logout", { method: "POST", token: response.token });
        } catch {
          // The unexpected token is discarded below even if revocation is unavailable.
        }
        return "admin_account";
      }
      setSessionExpired(false);
      setStudentToken(response.token);
      const slugs = response.user.role === "student" ? await fetchApprovedSlugs(response.token) : [];
      setUser(mapUser(response.user, slugs));
      return "ok";
    } catch (error) {
      if (error instanceof ApiError && error.status === 422) {
        if (error.message.includes("حساب أدمن")) return "admin_account";
        return "invalid";
      }
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
    setSessionExpired(false);
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

  async function refreshProfile() {
    const token = getStudentToken();
    if (!token) return;
    const response = await apiRequest<{ user: ApiUser }>("/me", { token });
    setUser((current) => mapUser(response.user, current?.approvedCourseSlugs ?? []));
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
      refreshProfile,
      refreshAccess,
      requestSubscription,
      hasAccess: (courseSlug) => Boolean(user?.approvedCourseSlugs.includes(courseSlug)),
    }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      {sessionExpired && (
        <div
          className="fixed inset-0 z-[200] grid place-items-center bg-black/45 px-4"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="session-expired-title"
          dir="rtl"
        >
          <div className="w-full max-w-md rounded-3xl bg-white p-7 text-center shadow-2xl">
            <h2 id="session-expired-title" className="text-2xl font-bold text-gray-950">
              تم تسجيل خروجك
            </h2>
            <p className="mt-3 leading-7 text-gray-600">
              تم فتح الحساب من جهاز أو متصفح آخر، لذلك أُغلقت هذه الجلسة لحماية حسابك.
            </p>
            <button
              type="button"
              onClick={() => setSessionExpired(false)}
              className="mt-6 w-full rounded-full bg-[var(--color-primary)] px-5 py-3 font-bold text-white"
            >
              تسجيل الدخول مرة أخرى
            </button>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
