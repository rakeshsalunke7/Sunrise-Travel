import axios, { AxiosError } from "axios";

import { clearAuth, getToken } from "@/lib/authStore";

export const API_BASE_URL =
  (import.meta.env["VITE_API_BASE_URL"] as string | undefined) ?? "http://localhost:8080";

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 20000,
});

axiosClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;

    if (status === 401) {
      clearAuth();
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        window.location.replace("/login?expired=1");
      }
    }

    return Promise.reject(error);
  },
);

/** Turns any backend/axios failure into a short, user-safe message. */
export function getApiErrorMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    if (status === 403) {
      return "You don't have permission to perform this action.";
    }
    if (!error.response) {
      return "Unable to reach the server. Please check your connection and try again.";
    }
    const data = error.response.data as unknown;
    if (typeof data === "string" && data.length > 0 && data.length < 300 && !data.includes("<html")) {
      return data;
    }
    if (data && typeof data === "object") {
      const record = data as Record<string, unknown>;
      for (const key of ["message", "error", "detail"]) {
        const value = record[key];
        if (typeof value === "string" && value.trim() && !value.includes("Exception")) {
          return value;
        }
      }
    }
    if (status === 404) return "The requested information could not be found.";
    if (status && status >= 500) return "The server could not process this request right now.";
  }
  return fallback;
}

export default axiosClient;
