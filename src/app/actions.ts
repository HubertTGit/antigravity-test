'use server';

import { db } from '@/lib/db';
import { todos } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getTodos(userId: string) {
  return await db
    .select()
    .from(todos)
    .where(eq(todos.userTodoId, userId))
    .orderBy(desc(todos.createdAt));
}

export async function addTodo(userId: string, text: string) {
  await db.insert(todos).values({
    text,
    userTodoId: userId,
  });
  revalidatePath(`/todo/${userId}`);
}

export async function toggleTodo(id: string) {
  const todo = await db.select().from(todos).where(eq(todos.id, id)).limit(1);
  if (todo.length > 0) {
    await db
      .update(todos)
      .set({ completed: !todo[0].completed })
      .where(eq(todos.id, id));
    revalidatePath(`/todo/${todo[0].userTodoId}`);
  }
}

export async function deleteTodo(id: string) {
  const todo = await db.select().from(todos).where(eq(todos.id, id)).limit(1);
  if (todo.length > 0) {
    await db.delete(todos).where(eq(todos.id, id));
    revalidatePath(`/todo/${todo[0].userTodoId}`);
  }
}

export async function deleteCompletedTodos(userId: string) {
  await db
    .delete(todos)
    .where(and(eq(todos.userTodoId, userId), eq(todos.completed, true)));
  revalidatePath(`/todo/${userId}`);
}

export async function updateTodo(id: string, text: string) {
  const todo = await db.select().from(todos).where(eq(todos.id, id)).limit(1);
  if (todo.length > 0) {
    await db.update(todos).set({ text }).where(eq(todos.id, id));
    revalidatePath(`/todo/${todo[0].userTodoId}`);
  }
}
