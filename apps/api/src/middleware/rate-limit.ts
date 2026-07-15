import { getConnInfo } from '@hono/node-server/conninfo';
import type { Context, MiddlewareHandler } from 'hono';

export function getClientIp(c: Context): string {
  const forwardedFor = c.req.header('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0]!.trim();
  return getConnInfo(c).remote.address ?? 'unknown';
}

interface RateLimitOptions {
  windowMs: number;
  max: number;
  keyGenerator?: (c: Context) => string;
}

interface Bucket {
  count: number;
  resetAt: number;
}

// In-memory store, scoped per rateLimiter() instance — each route/tier that calls this
// factory gets its own independent counters. Fine for a single Node process; swap for a
// Redis-backed store (same interface) if the API ever runs multiple instances.
export function rateLimiter({ windowMs, max, keyGenerator }: RateLimitOptions): MiddlewareHandler {
  const store = new Map<string, Bucket>();

  const cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of store) {
      if (bucket.resetAt <= now) store.delete(key);
    }
  }, windowMs);
  cleanupTimer.unref();

  return async (c, next) => {
    const key = keyGenerator ? keyGenerator(c) : getClientIp(c);
    const now = Date.now();
    const bucket = store.get(key);

    if (!bucket || bucket.resetAt <= now) {
      store.set(key, { count: 1, resetAt: now + windowMs });
    } else {
      bucket.count += 1;
      if (bucket.count > max) {
        c.header('Retry-After', String(Math.ceil((bucket.resetAt - now) / 1000)));
        return c.json({ error: 'Too many requests' }, 429);
      }
    }

    await next();
  };
}
