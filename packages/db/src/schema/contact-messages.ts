import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { contactMessageStatusEnum } from './enums.js';

export const contactMessages = pgTable('contact_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone'),
  subject: text('subject'),
  message: text('message').notNull(),
  status: contactMessageStatusEnum('status').notNull().default('new'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
