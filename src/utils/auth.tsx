import { jwtDecode } from "jwt-decode";

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

export const clearAuth = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('role');
};

type JwtPayload = {
  sub?: string | number;
  id?: string | number;
  [key: string]: unknown;
};

export const getCurrentUserId = (): number | null => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const userId = decoded.sub ?? decoded.id;
    if (typeof userId === "string") return parseInt(userId, 10) || null;
    if (typeof userId === "number") return userId;
    return null;
  } catch {
    return null;
  }
};