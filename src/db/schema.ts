import { pgTable, serial, text, boolean, timestamp } from 'drizzle-orm/pg-core';

export const todos = pgTable('todos', {
  id: serial('id').primaryKey(),
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
