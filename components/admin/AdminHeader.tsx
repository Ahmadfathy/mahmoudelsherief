import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, Shield, UserRoundCog } from "lucide-react";
import { adminLogout } from "@/lib/admin-auth";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `h-9 px-4 rounded-full text-sm font-bold flex items-center transition-colors ${
    isActive
      ? "bg-[var(--color-primary)] text-white"
      : "hover:bg-[var(--color-subtle)] text-[var(--color-fg)]"
  }`;

export function AdminHeader() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[var(--color-bg)]/90 border-b border-[var(--color-border)]">
      <div className="max-w-5xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div
            className="flex items-center gap-2 font-bold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <Shield size={20} className="text-[var(--color-primary)]" strokeWidth={1.75} />
            <span className="hidden sm:inline">لوحة تحكم الأدمن</span>
          </div>
          <nav className="flex items-center gap-1">
            <NavLink to="/admin/subscribers" className={navLinkClass}>
              الطلاب
            </NavLink>
            <NavLink to="/admin/courses" className={navLinkClass}>
              الكورسات
            </NavLink>
            <NavLink to="/admin/payments" className={navLinkClass}>
              المدفوعات
            </NavLink>
            <NavLink to="/admin/discount-codes" className={navLinkClass}>
              أكواد الخصم
            </NavLink>
            <NavLink to="/admin/testimonials" className={navLinkClass}>
              آراء العملاء
            </NavLink>
          </nav>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <NavLink to="/admin/profile" className={navLinkClass} aria-label="حسابي">
            <UserRoundCog size={16} />
            <span className="hidden lg:inline">حسابي</span>
          </NavLink>
          <button
            type="button"
            onClick={() => {
              void adminLogout().finally(() => navigate("/admin", { replace: true }));
            }}
            className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-bold text-red-500 transition-colors hover:bg-red-500/10"
          >
            <LogOut size={15} />
            <span className="hidden lg:inline">تسجيل الخروج</span>
          </button>
        </div>
      </div>
    </header>
  );
}
