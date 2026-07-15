import type { MiddlewareHandler } from 'hono';
import type { ZodSchema } from 'zod';

export function validateBody(schema: ZodSchema): MiddlewareHandler {
  return async (c, next) => {
    let raw: unknown;
    try {
      raw = await c.req.json();
    } catch {
      return c.json({ error: 'Invalid JSON body' }, 400);
    }

    const result = schema.safeParse(raw);
    if (!result.success) {
      return c.json({ error: 'Validation failed', details: result.error.flatten() }, 400);
    }

    c.set('validatedBody', result.data);
    await next();
  };
}
