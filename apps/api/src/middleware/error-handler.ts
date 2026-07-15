import type { ErrorHandler } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { env } from '../env.js';

export const errorHandler: ErrorHandler = (err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  console.error(err);

  if (env.NODE_ENV === 'production') {
    return c.json({ error: 'Internal Server Error' }, 500);
  }

  return c.json({ error: err.message, stack: err.stack }, 500);
};
