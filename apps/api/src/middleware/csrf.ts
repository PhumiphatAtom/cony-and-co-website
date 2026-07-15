import { getCookie } from 'hono/cookie';
import type { MiddlewareHandler } from 'hono';
import { CSRF_COOKIE_NAME } from '../lib/auth.js';

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

// Double-submit cookie check: the CSRF cookie is unreadable to a cross-site attacker
// page, so a header value matching it proves the request came from same-site JS.
export function csrfProtection(): MiddlewareHandler {
  return async (c, next) => {
    if (!MUTATING_METHODS.has(c.req.method)) {
      await next();
      return;
    }

    const cookieToken = getCookie(c, CSRF_COOKIE_NAME);
    const headerToken = c.req.header('x-csrf-token');

    if (!cookieToken || !headerToken || cookieToken !== headerToken) {
      return c.json({ error: 'Invalid or missing CSRF token' }, 403);
    }

    await next();
  };
}
