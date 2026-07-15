import { pgEnum } from 'drizzle-orm/pg-core';

export const productStatusEnum = pgEnum('product_status', ['active', 'inactive']);

export const contactMessageStatusEnum = pgEnum('contact_message_status', [
  'new',
  'in_progress',
  'replied',
]);

export const adminRoleEnum = pgEnum('admin_role', ['super_admin', 'staff']);
