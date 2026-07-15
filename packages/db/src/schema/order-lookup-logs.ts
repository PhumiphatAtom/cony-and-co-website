import { boolean, index, inet, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { orders } from './orders.js';

export const orderLookupLogs = pgTable(
  'order_lookup_logs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orderId: uuid('order_id').references(() => orders.id, { onDelete: 'set null' }),
    ipAddress: inet('ip_address').notNull(),
    success: boolean('success').notNull(),
    attemptedAt: timestamp('attempted_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    // Composite index for the rate-limit check (count attempts by IP within a time window)
    index('order_lookup_logs_ip_attempted_at_idx').on(table.ipAddress, table.attemptedAt),
  ]
);
