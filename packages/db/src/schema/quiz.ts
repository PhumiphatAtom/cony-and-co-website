import { integer, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { products } from './products.js';

export const quizQuestions = pgTable('quiz_questions', {
  id: uuid('id').primaryKey().defaultRandom(),
  questionText: text('question_text').notNull(),
  displayOrder: integer('display_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const quizOptions = pgTable('quiz_options', {
  id: uuid('id').primaryKey().defaultRandom(),
  questionId: uuid('question_id')
    .notNull()
    .references(() => quizQuestions.id, { onDelete: 'cascade' }),
  optionText: text('option_text').notNull(),
  // Mapping of product/character slug -> weight, e.g. { "mocha": 2, "latte": 1 }
  resultWeight: jsonb('result_weight').$type<Record<string, number>>().notNull().default({}),
});

export const quizResults = pgTable('quiz_results', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: text('session_id').notNull(),
  matchedProductId: uuid('matched_product_id').references(() => products.id, {
    onDelete: 'set null',
  }),
  submittedAt: timestamp('submitted_at', { withTimezone: true }).notNull().defaultNow(),
});
