import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { adminRoleEnum } from './enums.js';

export const adminUsers = pgTable('admin_users', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: adminRoleEnum('role').notNull().default('staff'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
