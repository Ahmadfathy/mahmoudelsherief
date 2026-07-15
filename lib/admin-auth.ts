import { useEffect, useState } from "react";
import { config } from "@/lib/config";

// جلسة السوبر أدمن — sessionStorage (بتتمسح لما التاب يتقفل) وتحقق client-side
// بس، مؤقت لحد ما يتحط backend حقيقي بيتحقق من كلمة السر على السيرفر.

const SESSION_KEY = "academy-admin-session";

export function adminLogin(email: string, password: string): boolean {
  const ok =
    email.trim().toLowerCase() === config.admin.email.toLowerCase() &&
    password === config.admin.password;
  if (ok) window.sessionStorage.setItem(SESSION_KEY, "1");
  return ok;
}

export function adminLogout() {
  window.sessionStorage.removeItem(SESSION_KEY);
}

export function useAdminSession() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(window.sessionStorage.getItem(SESSION_KEY) === "1");
  }, []);

  function login(email: string, password: string) {
    const ok = adminLogin(email, password);
    setIsAdmin(ok);
    return ok;
  }

  function logout() {
    adminLogout();
    setIsAdmin(false);
  }

  return { isAdmin, login, logout };
}
