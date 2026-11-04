import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, KeyRound, Save, UserRound } from "lucide-react";
import { EgyptPhoneInput, normalizeEgyptPhoneInput } from "@/components/academy/EgyptPhoneInput";
import { PasswordInput } from "@/components/academy/PasswordInput";
import { apiRequest, friendlyApiError } from "@/lib/api";

export type ProfileUser = {
  id: string | number;
  name: string;
  email: string;
  phone?: string | null;
  role: "student" | "admin";
  status: string;
};

type ProfileFormProps = {
  token: string;
  user: ProfileUser;
  onUpdated?: (user: ProfileUser) => void;
};

export function ProfileForm({ token, user, onUpdated }: ProfileFormProps) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(normalizeEgyptPhoneInput(user.phone ?? ""));
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
    setPhone(normalizeEgyptPhoneInput(user.phone ?? ""));
  }, [user.id, user.name, user.email, user.phone]);

  async function saveProfile(event: React.FormEvent) {
    event.preventDefault();
    setProfileError("");
    setProfileMessage("");
    setSavingProfile(true);
    try {
      const response = await apiRequest<{ message: string; user: ProfileUser }>("/profile", {
        method: "PATCH",
        token,
        body: JSON.stringify({ name, email, phone }),
      });
      setProfileMessage(response.message);
      onUpdated?.(response.user);
    } catch (error) {
      setProfileError(friendlyApiError(error, "تعذر حفظ بيانات الحساب."));
    } finally {
      setSavingProfile(false);
    }
  }

  async function savePassword(event: React.FormEvent) {
    event.preventDefault();
    setPasswordError("");
    setPasswordMessage("");
    if (password !== passwordConfirmation) {
      setPasswordError("تأكيد كلمة السر الجديدة غير مطابق.");
      return;
    }
    setSavingPassword(true);
    try {
      const response = await apiRequest<{ message: string }>("/profile/password", {
        method: "PUT",
        token,
        body: JSON.stringify({
          current_password: currentPassword,
          password,
          password_confirmation: passwordConfirmation,
        }),
      });
      setPasswordMessage(response.message);
      setCurrentPassword("");
      setPassword("");
      setPasswordConfirmation("");
    } catch (error) {
      setPasswordError(friendlyApiError(error, "تعذر تغيير كلمة السر."));
    } finally {
      setSavingPassword(false);
    }
  }

  const message = (text: string, error = false) => text ? (
    <div className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold ${error ? "bg-red-500/10 text-red-600" : "bg-green-500/10 text-green-600"}`} role={error ? "alert" : "status"}>
      {error ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
      <span>{text}</span>
    </div>
  ) : null;

  return (
    <div className="grid gap-6 lg:grid-cols-2" dir="rtl">
      <form onSubmit={saveProfile} className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-sm md:p-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]"><UserRound size={21} /></span>
          <div><h2 className="text-xl font-black">البيانات الشخصية</h2><p className="text-sm text-[var(--color-muted)]">عدّل بيانات حسابك الأساسية</p></div>
        </div>
        <div className="space-y-5">
          <label className="block"><span className="mb-2 block font-bold">الاسم</span><input value={name} onChange={(event) => setName(event.target.value)} required maxLength={255} autoComplete="name" className="h-12 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 outline-none focus:ring-2 focus:ring-[var(--color-primary)]" /></label>
          <label className="block"><span className="mb-2 block font-bold">البريد الإلكتروني</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" dir="ltr" className="h-12 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 text-left outline-none focus:ring-2 focus:ring-[var(--color-primary)]" /></label>
          <label className="block"><span className="mb-2 block font-bold">رقم الموبايل</span><EgyptPhoneInput value={phone} onChange={setPhone} inputBackgroundClassName="bg-[var(--color-bg)]" /></label>
          {message(profileError, true)}
          {message(profileMessage)}
          <button type="submit" disabled={savingProfile} className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"><Save size={18} />{savingProfile ? "جاري الحفظ..." : "حفظ التعديلات"}</button>
        </div>
      </form>

      <form onSubmit={savePassword} className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-sm md:p-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]"><KeyRound size={21} /></span>
          <div><h2 className="text-xl font-black">تغيير كلمة السر</h2><p className="text-sm text-[var(--color-muted)]">اكتب كلمة السر الحالية للتأكيد</p></div>
        </div>
        <div className="space-y-5">
          <label className="block"><span className="mb-2 block font-bold">كلمة السر الحالية</span><PasswordInput value={currentPassword} onChange={setCurrentPassword} placeholder="اكتب كلمة السر الحالية" autoComplete="current-password" /></label>
          <label className="block"><span className="mb-2 block font-bold">كلمة السر الجديدة</span><PasswordInput value={password} onChange={setPassword} placeholder="8 حروف أو أرقام على الأقل" autoComplete="new-password" minLength={8} /></label>
          <label className="block"><span className="mb-2 block font-bold">تأكيد كلمة السر الجديدة</span><PasswordInput value={passwordConfirmation} onChange={setPasswordConfirmation} placeholder="أعد كتابة كلمة السر الجديدة" autoComplete="new-password" minLength={8} /></label>
          {message(passwordError, true)}
          {message(passwordMessage)}
          <button type="submit" disabled={savingPassword} className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-[var(--color-primary)] font-bold text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)] hover:text-white disabled:opacity-60"><KeyRound size={18} />{savingPassword ? "جاري التغيير..." : "تغيير كلمة السر"}</button>
        </div>
      </form>
    </div>
  );
}
