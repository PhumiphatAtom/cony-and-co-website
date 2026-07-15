import type { Context } from 'hono';
import { deleteCookie, setCookie } from 'hono/cookie';
import { sign, verify } from 'hono/jwt';
import { env } from '../env.js';
import type { AdminJwtPayload, AdminRole } from '../types.js';

export const REFRESH_COOKIE_NAME = 'refresh_token';
export const CSRF_COOKIE_NAME = 'csrf_token';

const ACCESS_TOKEN_TTL_SECONDS = 15 * 60;
const REFRESH_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60;

interface AdminIdentity {
  id: string;
  username: string;
  role: AdminRole;
}

export function signAccessToken(admin: AdminIdentity): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const payload: AdminJwtPayload = {
    sub: admin.id,
    username: admin.username,
    role: admin.role,
    iat: now,
    exp: now + ACCESS_TOKEN_TTL_SECONDS,
  };
  return sign(payload, env.JWT_SECRET, 'HS256');
}

interface RefreshTokenPayload {
  [key: string]: unknown;
  sub: string;
  iat: number;
  exp: number;
}

export function signRefreshToken(adminId: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const payload: RefreshTokenPayload = {
    sub: adminId,
    iat: now,
    exp: now + REFRESH_TOKEN_TTL_SECONDS,
  };
  return sign(payload, env.JWT_REFRESH_SECRET, 'HS256');
}

export async function verifyRefreshToken(token: string): Promise<RefreshTokenPayload> {
  return (await verify(token, env.JWT_REFRESH_SECRET, 'HS256')) as RefreshTokenPayload;
}

// Sets the HttpOnly refresh-token cookie (scoped to /admin/auth only) and a readable
// CSRF token cookie (scoped to /admin) that the frontend echoes back via X-CSRF-Token
// on mutating requests. SameSite=Strict on both means a cross-site request never gets
// either cookie attached in the first place, which is what actually blocks CSRF here.
export function setAuthCookies(c: Context, refreshToken: string): string {
  const csrfToken = crypto.randomUUID();

  setCookie(c, REFRESH_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'Strict',
    path: '/admin/auth',
    maxAge: REFRESH_TOKEN_TTL_SECONDS,
  });

  setCookie(c, CSRF_COOKIE_NAME, csrfToken, {
    httpOnly: false,
    secure: env.NODE_ENV === 'production',
    sameSite: 'Strict',
    path: '/admin',
    maxAge: REFRESH_TOKEN_TTL_SECONDS,
  });

  return csrfToken;
}

export function clearAuthCookies(c: Context): void {
  deleteCookie(c, REFRESH_COOKIE_NAME, { path: '/admin/auth' });
  deleteCookie(c, CSRF_COOKIE_NAME, { path: '/admin' });
}
