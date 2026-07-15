import { Hono } from 'hono';
import { serve } from '@hono/node-server';

const app = new Hono();

app.get('/', (c) => c.json({ status: 'ok', service: 'cony-co-api' }));

const port = Number(process.env.PORT) || 3001;

serve({ fetch: app.fetch, port }, () => {
  console.log(`API running on http://localhost:${port}`);
});
