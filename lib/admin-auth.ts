import { useEffect, useState } from "react";
import { ApiError, apiRequest, getAdminToken, setAdminToken } from "@/lib/api";

type AdminUser = { id: number; name: string; email: string; role: string; status: string };

export async function adminLogin(phone: string, password: string) {
  const response = await apiRequest<{ user: AdminUser; token: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ phone, password, device_name: "academy-admin" }),
  });
  if (response.user.role !== "admin") {
    try {
      await apiRequest("/auth/logout", { method: "POST", token: response.token });
    } catch {
      // The token is discarded below even if revocation is unavailable.
    }
    throw new ApiError("الحساب ده مش حساب أدمن.", 403);
  }
  setAdminToken(response.token);
  return response.user;
}

export async function adminLogout() {
  const token = getAdminToken();
  try {
    if (token) await apiRequest("/auth/logout", { method: "POST", token });
  } finally {
    setAdminToken(null);
  }
}

export function useAdminSession() {
  const [isAdmin, setIsAdmin] = useState(Boolean(getAdminToken()));
  const [checking, setChecking] = useState(Boolean(getAdminToken()));

  useEffect(() => {
    const sync = () => setIsAdmin(Boolean(getAdminToken()));
    window.addEventListener("admin-auth-changed", sync);
    return () => window.removeEventListener("admin-auth-changed", sync);
  }, []);

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      setChecking(false);
      return;
    }
    apiRequest<{ user: AdminUser }>("/me", { token })
      .then(({ user }) => {
        if (user.role !== "admin") setAdminToken(null);
        else setIsAdmin(true);
      })
      .catch(() => setAdminToken(null))
      .finally(() => setChecking(false));
  }, []);

  return { isAdmin, checking, login: adminLogin, logout: adminLogout };
}
