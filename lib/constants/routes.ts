/**
 * Centralized route constants for the entire app
 * Use these instead of hardcoding route strings to avoid typos and ensure consistency
 */

// ============================================
// AUTH ROUTES
// ============================================
export const AUTH_ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  CALLBACK: "/auth/callback",
} as const;

// Routes that are publicly accessible (don't require auth)
export const PUBLIC_AUTH_ROUTES = [
  AUTH_ROUTES.LOGIN,
  AUTH_ROUTES.REGISTER,
  "/(auth)", // Layout group
] as const;

// ============================================
// DASHBOARD ROUTES
// ============================================
export const DASHBOARD_ROUTES = {
  HOME: "/dashboard",
  OWNER: "/owner",
  CREATE_FIELD: "/create-field",
  CREATE_EVENT: "/create-event",
} as const;

// ============================================
// PUBLIC ROUTES
// ============================================
export const PUBLIC_ROUTES = {
  EVENTS: "/events",
  EVENT_DETAIL: (id: string) => `/events/${id}`,
  BOOKING_SUCCESS: (bookingId: string) => `/booking/success/${bookingId}`,
  WAIVER_SIGN: (bookingId: string) => `/sign/${bookingId}`,
} as const;

// ============================================
// DEFAULT REDIRECTS
// ============================================
export const DEFAULT_REDIRECTS = {
  AFTER_LOGIN: DASHBOARD_ROUTES.HOME,
  AFTER_LOGOUT: AUTH_ROUTES.LOGIN,
  AFTER_REGISTER: DASHBOARD_ROUTES.HOME,
  IF_NO_FIELDS: DASHBOARD_ROUTES.CREATE_FIELD,
  IF_NOT_OWNER: DASHBOARD_ROUTES.HOME,
  HOME: "/",
} as const;

/**
 * Check if a pathname is an auth route
 * Used in middleware for auth checks
 */
export function isAuthRoute(pathname: string): boolean {
  return PUBLIC_AUTH_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * Get query params for redirect after login
 * Used when redirecting unauthenticated users to login
 */
export function getLoginRedirectParams(redirectTo?: string) {
  if (!redirectTo) return {};
  return { redirect: redirectTo };
}
