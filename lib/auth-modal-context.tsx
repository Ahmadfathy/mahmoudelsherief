import { createContext, useContext, useState, type ReactNode } from "react";
import { LoginModal } from "@/components/academy/LoginModal";

// Context مشترك عشان أي صفحة (هيدر الأكاديمية، صفحة كورس مقفولة، صفحة
// التسجيل) تقدر تفتح نفس modal تسجيل الدخول من غير ما تكرره.

type AuthModalContextValue = {
  openLogin: () => void;
};

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <AuthModalContext.Provider value={{ openLogin: () => setOpen(true) }}>
      {children}
      <LoginModal open={open} onClose={() => setOpen(false)} />
    </AuthModalContext.Provider>
  );
}

export function useAuthModal(): AuthModalContextValue {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error("useAuthModal must be used within AuthModalProvider");
  return ctx;
}
