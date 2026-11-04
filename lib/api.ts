const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api/v1").replace(/\/$/, "");

const STUDENT_TOKEN_KEY = "academy-api-token";
const ADMIN_TOKEN_KEY = "academy-admin-api-token";
export const STUDENT_SESSION_EXPIRED_EVENT = "academy-student-session-expired";

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

export function getStudentToken() {
  return window.localStorage.getItem(STUDENT_TOKEN_KEY);
}

export function setStudentToken(token: string | null) {
  if (token) window.localStorage.setItem(STUDENT_TOKEN_KEY, token);
  else window.localStorage.removeItem(STUDENT_TOKEN_KEY);
}

export function getAdminToken() {
  return window.sessionStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token: string | null) {
  if (token) window.sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
  else window.sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  window.dispatchEvent(new Event("admin-auth-changed"));
}

export function apiUrl(path: string) {
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

const FIELD_LABELS: Record<string, string> = {
  name: "الاسم",
  email: "البريد الإلكتروني",
  phone: "رقم الموبايل",
  password: "كلمة السر",
  password_confirmation: "تأكيد كلمة السر",
  current_password: "كلمة السر الحالية",
  course_id: "الكورس",
  receipt: "صورة الإيصال",
};

function translateValidationMessage(message: string) {
  const fieldMatch = message.match(/^The ([\w.]+) field/);
  const field = fieldMatch ? (FIELD_LABELS[fieldMatch[1]] ?? "هذا الحقل") : "هذا الحقل";

  if (/field is required\.?$/i.test(message)) return `${field} مطلوب.`;
  if (/field format is invalid\.?$/i.test(message)) return `${field} غير صحيح.`;
  if (/has already been taken\.?$/i.test(message)) return `${field} مسجل بالفعل.`;
  if (/must be a valid email address\.?$/i.test(message)) return "من فضلك اكتب بريدًا إلكترونيًا صحيحًا.";
  if (/confirmation does not match\.?$/i.test(message)) return "تأكيد كلمة السر غير مطابق.";
  if (/must be at least (\d+) characters/i.test(message)) {
    const minimum = message.match(/must be at least (\d+) characters/i)?.[1] ?? "8";
    return `${field} يجب ألا يقل عن ${minimum} حروف أو أرقام.`;
  }
  if (/selected .* is invalid\.?$/i.test(message)) return `${field} المحدد غير صالح.`;
  if (message === "Unauthenticated.") return "انتهت جلسة الدخول. سجّل الدخول مرة أخرى.";
  if (message === "Invalid credentials.") return "رقم الموبايل أو كلمة السر غير صحيحة.";
  if (message === "This account is not active.") return "هذا الحساب موقوف. تواصل مع الإدارة.";
  return message;
}

function errorMessage(payload: unknown, fallback: string) {
  if (!payload || typeof payload !== "object") return fallback;
  const data = payload as { message?: string; errors?: Record<string, string[]> };
  const message = Object.values(data.errors ?? {})[0]?.[0] ?? data.message ?? fallback;
  return translateValidationMessage(message);
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit & { token?: string | null } = {}
): Promise<T> {
  const { token, headers, ...requestOptions } = options;
  const requestHeaders = new Headers(headers);
  requestHeaders.set("Accept", "application/json");
  if (token) requestHeaders.set("Authorization", `Bearer ${token}`);
  if (requestOptions.body && !(requestOptions.body instanceof FormData)) {
    requestHeaders.set("Content-Type", "application/json");
  }

  const response = await fetch(apiUrl(path), { ...requestOptions, headers: requestHeaders });
  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    const body = payload as { message?: string; errors?: Record<string, string[]> } | null;
    if (
      response.status === 401 &&
      token &&
      typeof window !== "undefined" &&
      token === getStudentToken()
    ) {
      window.dispatchEvent(new CustomEvent(STUDENT_SESSION_EXPIRED_EVENT));
    }
    const fallbackMessage = response.status === 413
      ? "حجم الملف أكبر من الحد المسموح به على السيرفر."
      : `Request failed (${response.status})`;
    throw new ApiError(
      errorMessage(body, fallbackMessage),
      response.status,
      body?.errors
    );
  }

  return payload as T;
}

export async function apiDownload(path: string, token: string): Promise<Blob> {
  const response = await fetch(apiUrl(path), {
    headers: { Accept: "*/*", Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new ApiError("تعذر تحميل الملف.", response.status);
  return response.blob();
}

export function friendlyApiError(error: unknown, fallback = "حصل خطأ، حاول مرة تانية.") {
  if (error instanceof ApiError) return error.message;
  if (error instanceof TypeError) return "تعذر الاتصال بالسيرفر. تأكد إن الباك شغال.";
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

