"use server";

import { db } from "@/lib/db";
import { todos } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getTodos(userId: string) {
  return await db
    .select()
    .from(todos)
    .where(eq(todos.userTodoId, userId))
    .orderBy(desc(todos.createdAt));
}

export async function addTodo(todoId: string, text: string, socketId?: string) {
  const newTodo = await db
    .insert(todos)
    .values({
      text,
      userTodoId: todoId,
    })
    .returning();

  if (global.io && socketId) {
    global.io.except(socketId).emit("notification:todo_created", {
      action: "CREATE",
      todoId: newTodo[0].id,
      title: text,
      user: "Someone", // In a real app, we'd get the user's name
      timestamp: newTodo[0].createdAt,
    });
  }

  revalidatePath(`/todo/${todoId}`);
}

export async function toggleTodo(id: string, socketId?: string) {
  const todo = await db.select().from(todos).where(eq(todos.id, id)).limit(1);
  if (todo.length > 0) {
    const updatedTodo = await db
      .update(todos)
      .set({ completed: !todo[0].completed })
      .where(eq(todos.id, id))
      .returning();

    if (global.io && socketId) {
      global.io.except(socketId).emit("notification:todo_updated", {
        action: "UPDATE",
        todoId: id,
        updatedFields: ["completed"],
        user: "Someone",
        title: todo[0].text,
      });
    }

    revalidatePath(`/todo/${todo[0].userTodoId}`);
  }
}

export async function deleteTodo(id: string, socketId?: string) {
  const todo = await db.select().from(todos).where(eq(todos.id, id)).limit(1);
  if (todo.length > 0) {
    await db.delete(todos).where(eq(todos.id, id));

    if (global.io && socketId) {
      global.io.except(socketId).emit("notification:todo_deleted", {
        action: "DELETE",
        todoId: id,
        user: "Someone",
      });
    }

    revalidatePath(`/todo/${todo[0].userTodoId}`);
  }
}

export async function deleteCompletedTodos(userId: string) {
  await db
    .delete(todos)
    .where(and(eq(todos.userTodoId, userId), eq(todos.completed, true)));
  revalidatePath(`/todo/${userId}`);
}

export async function updateTodo(id: string, text: string, socketId?: string) {
  const todo = await db.select().from(todos).where(eq(todos.id, id)).limit(1);
  if (todo.length > 0) {
    await db.update(todos).set({ text }).where(eq(todos.id, id));

    if (global.io && socketId) {
      global.io.except(socketId).emit("notification:todo_updated", {
        action: "UPDATE",
        todoId: id,
        updatedFields: ["text"],
        user: "Someone",
        title: text,
      });
    }

    revalidatePath(`/todo/${todo[0].userTodoId}`);
  }
}
