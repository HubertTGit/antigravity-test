import { pgTable, text, boolean, timestamp, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const todos = pgTable('todos', {
  id: uuid('id').primaryKey().defaultRandom(),
  text: text('text').notNull(),
  completed: boolean('completed').default(false).notNull(),
  userTodoId: text('user_todo_id')
    .notNull()
    .references(() => users.userTodoId, { onDelete: 'cascade' }), // FK: one user → one todo
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const users = pgTable('users', {
  userId: text('user_id').primaryKey(),
  userTodoId: text('user_todo_id').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  todos: many(todos),
}));

export const todosRelations = relations(todos, ({ one }) => ({
  user: one(users, {
    fields: [todos.userTodoId],
    references: [users.userTodoId],
  }),
}));
