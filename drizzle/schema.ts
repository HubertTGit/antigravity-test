import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core';

export const todos = pgTable('todos', {
  id: uuid('id').primaryKey().defaultRandom(),
  text: text().notNull(),
  completed: boolean().default(false).notNull(),
  userId: text('user_id').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
});

export const users = pgTable(
  'users',
  {
    userId: text('user_id').primaryKey().notNull(),
    userTodoId: text('user_todo_id').notNull(),
    createdAt: timestamp('created_at', { mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [unique('users_user_todo_id_unique').on(table.userTodoId)]
);
