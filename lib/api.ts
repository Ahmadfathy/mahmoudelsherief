const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api/v1").replace(/\/$/, "");

const STUDENT_TOKEN_KEY = "academy-api-token";
const ADMIN_TOKEN_KEY = "academy-admin-api-token";

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

function errorMessage(payload: unknown, fallback: string) {
  if (!payload || typeof payload !== "object") return fallback;
  const data = payload as { message?: string; errors?: Record<string, string[]> };
  return Object.values(data.errors ?? {})[0]?.[0] ?? data.message ?? fallback;
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
    throw new ApiError(
      errorMessage(body, `Request failed (${response.status})`),
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
  return fallback;
}

