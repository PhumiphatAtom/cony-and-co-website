import { boolean, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  // Public-facing lookup key (replaces the guessable sequential order number, see requirement.md 6.3.3)
  orderToken: uuid('order_token').notNull().unique().defaultRandom(),
  // Sequential order number from the source Google Sheet — internal/admin use only, never exposed to users
  sourceOrderNumber: integer('source_order_number').notNull().unique(),
  accountName: text('account_name').notNull(),
  recipientName: text('recipient_name').notNull(),
  // Ciphertext — encrypted/decrypted at the application layer, never in plaintext here
  address: text('address'),
  phone: text('phone'),
  productName: text('product_name').notNull(),
  size: text('size'),
  quantity: integer('quantity').notNull().default(1),
  giftWrap: boolean('gift_wrap').notNull().default(false),
  note: text('note'),
  // Raw status string synced from the Sheet (values vary/are inconsistent at the source);
  // normalized into a user-facing timeline at the application layer, not enforced as an enum here
  status: text('status'),
  lot: text('lot'),
  trackingNumberRaw: text('tracking_number_raw'),
  trackingNumberNormalized: text('tracking_number_normalized'),
  syncedAt: timestamp('synced_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
