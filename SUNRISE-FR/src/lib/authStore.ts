export type Role = "EMPLOYEE" | "TRAVEL_APPROVER" | "TRAVEL_ADMIN";

export type AuthSession = {
  token: string;
  role: Role;
  email: string;
};

const STORAGE_KEY = "sunrise.auth";
const listeners = new Set<() => void>();

function read(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthSession;
    return parsed?.token && parsed?.role ? parsed : null;
  } catch {
    return null;
  }
}

let cached: AuthSession | null = read();

function emit() {
  listeners.forEach((listener) => listener());
}

export function subscribeAuth(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSession(): AuthSession | null {
  return cached;
}

export function getToken(): string | null {
  return cached?.token ?? null;
}

export function setAuth(session: AuthSession) {
  cached = session;
  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }
  emit();
}

export function clearAuth() {
  cached = null;
  if (typeof window !== "undefined") {
    window.sessionStorage.removeItem(STORAGE_KEY);
  }
  emit();
}

export const roleHome: Record<Role, string> = {
  EMPLOYEE: "/employee",
  TRAVEL_APPROVER: "/approver",
  TRAVEL_ADMIN: "/admin",
};

export const roleLabel: Record<Role, string> = {
  EMPLOYEE: "Employee",
  TRAVEL_APPROVER: "Travel Approver",
  TRAVEL_ADMIN: "Travel Administrator",
};
