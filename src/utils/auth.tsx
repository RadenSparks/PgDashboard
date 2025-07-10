import { jwtDecode } from "jwt-decode";

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

export const clearAuth = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('role');
};

export const getCurrentUserId = (): number | null => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const decoded: any = jwtDecode(token); // <-- FIXED
    return decoded?.sub || decoded?.id || null;
  } catch {
    return null;
  }
};