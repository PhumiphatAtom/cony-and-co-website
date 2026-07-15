import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { jwt } from 'hono/jwt';
import { secureHeaders } from 'hono/secure-headers';
import { env } from './env.js';
import { csrfProtection } from './middleware/csrf.js';
import { errorHandler } from './middleware/error-handler.js';
import { rateLimiter } from './middleware/rate-limit.js';
import { rbacGuard } from './middleware/rbac.js';
import { requestLogger } from './middleware/request-logger.js';
import { adminAuthRoutes } from './routes/admin/auth.js';
import type { AppEnv } from './types.js';

export const app = new Hono<AppEnv>();

// 1. Security headers — applied to every request
app.use('*', secureHeaders());

// 2. CORS — only the configured frontend origin, with credentials (cookies) allowed
app.use(
  '*',
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  })
);

// 3. Request logging — every request in/out
app.use('*', requestLogger());

// 4. Rate limiting — generous global default; tighter per-route limits (e.g. login) layer on top
app.use('*', rateLimiter({ windowMs: 60_000, max: 100 }));

// --- Public routes (1-5, 9-10 only — no JWT/RBAC/CSRF) ---
app.get('/', (c) => c.json({ status: 'ok', service: 'cony-co-api' }));

// Auth lifecycle endpoints (login/refresh/logout) issue or consume tokens themselves, so
// they can't sit behind the JWT gate they're providing. Login has no CSRF cookie yet by
// definition; refresh/logout rely on a SameSite=Strict cookie, which a cross-site request
// never has attached in the first place, so the double-submit CSRF check is redundant here.
app.route('/admin/auth', adminAuthRoutes);

// --- Admin routes (1-10, all of them, no exceptions) ---
const admin = new Hono<AppEnv>();
admin.use('*', jwt({ secret: env.JWT_SECRET, alg: 'HS256' }));
admin.use('*', rbacGuard(['super_admin', 'staff']));
admin.use('*', csrfProtection());

admin.get('/me', (c) => {
  const payload = c.get('jwtPayload');
  return c.json({ id: payload.sub, username: payload.username, role: payload.role });
});

app.route('/admin', admin);

// 10. Centralized error handler — never leak stack traces in production
app.onError(errorHandler);
