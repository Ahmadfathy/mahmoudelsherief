import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAdminSession } from "@/lib/admin-auth";
import { AdminHeader } from "./AdminHeader";

export function AdminGuard({ children }: { children: ReactNode }) {
  const { isAdmin, checking } = useAdminSession();

  if (checking) return <div className="min-h-screen grid place-items-center">جاري التحقق...</div>;

  if (!isAdmin) return <Navigate to="/admin" replace />;

  return (
    <div className="min-h-screen bg-[var(--color-bg)]" dir="rtl">
      <AdminHeader />
      <main className="max-w-5xl mx-auto px-5 md:px-8 py-8">{children}</main>
    </div>
  );
}
