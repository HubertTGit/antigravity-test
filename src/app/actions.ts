'use server';

import { db } from '@/lib/db';
import { todos } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getTodos(userId: string) {
  return await db.select().from(todos).where(eq(todos.userId, userId)).orderBy(desc(todos.createdAt));
}

export async function addTodo(userId: string, text: string) {
  await db.insert(todos).values({
    text,
    userId,
  });
  revalidatePath(`/todo/${userId}`);
}

export async function toggleTodo(id: number) {
  const todo = await db.select().from(todos).where(eq(todos.id, id)).limit(1);
  if (todo.length > 0) {
    await db
      .update(todos)
      .set({ completed: !todo[0].completed })
      .where(eq(todos.id, id));
    revalidatePath(`/todo/${todo[0].userId}`);
  }
}

export async function deleteTodo(id: number) {
  const todo = await db.select().from(todos).where(eq(todos.id, id)).limit(1);
  if (todo.length > 0) {
    await db.delete(todos).where(eq(todos.id, id));
    revalidatePath(`/todo/${todo[0].userId}`);
  }
}

export async function updateTodo(id: number, text: string) {
  const todo = await db.select().from(todos).where(eq(todos.id, id)).limit(1);
  if (todo.length > 0) {
    await db
      .update(todos)
      .set({ text })
      .where(eq(todos.id, id));
    revalidatePath(`/todo/${todo[0].userId}`);
  }
}

