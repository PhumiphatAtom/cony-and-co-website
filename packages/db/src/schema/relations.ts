import { relations } from 'drizzle-orm';
import { orderLookupLogs } from './order-lookup-logs.js';
import { orders } from './orders.js';
import { products } from './products.js';
import { quizOptions, quizQuestions, quizResults } from './quiz.js';

export const quizQuestionsRelations = relations(quizQuestions, ({ many }) => ({
  options: many(quizOptions),
}));

export const quizOptionsRelations = relations(quizOptions, ({ one }) => ({
  question: one(quizQuestions, {
    fields: [quizOptions.questionId],
    references: [quizQuestions.id],
  }),
}));

export const quizResultsRelations = relations(quizResults, ({ one }) => ({
  matchedProduct: one(products, {
    fields: [quizResults.matchedProductId],
    references: [products.id],
  }),
}));

export const productsRelations = relations(products, ({ many }) => ({
  quizResults: many(quizResults),
}));

export const ordersRelations = relations(orders, ({ many }) => ({
  lookupLogs: many(orderLookupLogs),
}));

export const orderLookupLogsRelations = relations(orderLookupLogs, ({ one }) => ({
  order: one(orders, {
    fields: [orderLookupLogs.orderId],
    references: [orders.id],
  }),
}));
