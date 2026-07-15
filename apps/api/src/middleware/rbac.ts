import type { MiddlewareHandler } from 'hono';
import type { AdminRole, AppEnv } from '../types.js';

export function rbacGuard(allowedRoles: AdminRole[]): MiddlewareHandler<AppEnv> {
  return async (c, next) => {
    const payload = c.get('jwtPayload');
    if (!payload || !allowedRoles.includes(payload.role)) {
      return c.json({ error: 'Forbidden' }, 403);
    }
    await next();
  };
}
