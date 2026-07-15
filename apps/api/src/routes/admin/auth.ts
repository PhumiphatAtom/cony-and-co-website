import { adminLoginSchema, type AdminLoginInput } from '@cony-co/shared';
import { adminUsers, db } from '@cony-co/db';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { getCookie } from 'hono/cookie';
import {
  clearAuthCookies,
  REFRESH_COOKIE_NAME,
  setAuthCookies,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../../lib/auth.js';
import { verifyPasswordTimingSafe } from '../../lib/password.js';
import { rateLimiter } from '../../middleware/rate-limit.js';
import { validateBody } from '../../middleware/validate.js';
import type { AppEnv } from '../../types.js';

export const adminAuthRoutes = new Hono<AppEnv>();

// Strictest limit in the system — this is the endpoint a password brute-forcer targets.
const loginRateLimit = rateLimiter({ windowMs: 15 * 60_000, max: 5 });

adminAuthRoutes.post('/login', loginRateLimit, validateBody(adminLoginSchema), async (c) => {
  const { username, password } = c.get('validatedBody') as AdminLoginInput;

  const [admin] = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.username, username))
    .limit(1);

  const valid = await verifyPasswordTimingSafe(password, admin?.passwordHash ?? null);
  if (!admin || !valid) {
    // Identical response for "no such user" and "wrong password" — avoids
    // leaking which usernames exist (see requirement.md 6.3.3, same principle).
    return c.json({ error: 'Invalid username or password' }, 401);
  }

  const identity = { id: admin.id, username: admin.username, role: admin.role };
  const accessToken = await signAccessToken(identity);
  const refreshToken = await signRefreshToken(admin.id);
  const csrfToken = setAuthCookies(c, refreshToken);

  return c.json({ accessToken, csrfToken, admin: identity });
});

adminAuthRoutes.post('/refresh', async (c) => {
  const token = getCookie(c, REFRESH_COOKIE_NAME);
  if (!token) return c.json({ error: 'Missing refresh token' }, 401);

  let payload: Awaited<ReturnType<typeof verifyRefreshToken>>;
  try {
    payload = await verifyRefreshToken(token);
  } catch {
    return c.json({ error: 'Invalid or expired refresh token' }, 401);
  }

  const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.id, payload.sub)).limit(1);
  if (!admin) return c.json({ error: 'Invalid or expired refresh token' }, 401);

  const identity = { id: admin.id, username: admin.username, role: admin.role };
  const accessToken = await signAccessToken(identity);
  const refreshToken = await signRefreshToken(admin.id);
  const csrfToken = setAuthCookies(c, refreshToken);

  return c.json({ accessToken, csrfToken });
});

adminAuthRoutes.post('/logout', (c) => {
  clearAuthCookies(c);
  return c.json({ success: true });
});
