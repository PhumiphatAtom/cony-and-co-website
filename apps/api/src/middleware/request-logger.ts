import type { MiddlewareHandler } from 'hono';
import { getClientIp } from './rate-limit.js';

export function requestLogger(): MiddlewareHandler {
  return async (c, next) => {
    const timestamp = new Date().toISOString();
    const start = performance.now();

    await next();

    const durationMs = Math.round(performance.now() - start);
    console.log(
      JSON.stringify({
        timestamp,
        method: c.req.method,
        path: c.req.path,
        ip: getClientIp(c),
        status: c.res.status,
        durationMs,
      })
    );
  };
}
