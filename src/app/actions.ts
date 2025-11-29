"use server";

import { createServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { Todo } from "@/types/todo";

export async function getTodos(userId: string): Promise<Todo[]> {
  const supabase = await createServer();
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .eq("user_todo_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
}

export async function addTodo(todoId: string, text: string): Promise<Todo> {
  const supabase = await createServer();
  const { data, error } = await supabase
    .from("todos")
    .insert({
      text,
      user_todo_id: todoId,
    })
    .select()
    .single();

  if (error || !data) {
    throw error || new Error("Failed to create todo");
  }

  revalidatePath(`/todo/${todoId}`);
  return data;
}

export async function toggleTodo(id: string): Promise<Todo | null> {
  const supabase = await createServer();
  // Fetch current todo to get completed state and userTodoId
  const { data: todo, error: fetchError } = await supabase
    .from("todos")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !todo) {
    return null;
  }

  const { data, error: updateError } = await supabase
    .from("todos")
    .update({ completed: !todo.completed })
    .eq("id", id)
    .select()
    .single();

  if (updateError || !data) {
    throw updateError || new Error("Failed to update todo");
  }

  revalidatePath(`/todo/${todo.user_todo_id}`);
  return data;
}

export async function deleteTodo(id: string): Promise<void> {
  const supabase = await createServer();
  // Fetch todo to get userTodoId before deleting
  const { data: todo, error: fetchError } = await supabase
    .from("todos")
    .select("user_todo_id")
    .eq("id", id)
    .single();

  if (fetchError || !todo) {
    return;
  }

  const { error: deleteError } = await supabase
    .from("todos")
    .delete()
    .eq("id", id);

  if (deleteError) {
    throw deleteError;
  }

  revalidatePath(`/todo/${todo.user_todo_id}`);
}

export async function deleteCompletedTodos(id: string): Promise<void> {
  const supabase = await createServer();
  const { error } = await supabase
    .from("todos")
    .delete()
    .eq("user_todo_id", id)
    .eq("completed", true);

  if (error) {
    throw error;
  }

  revalidatePath(`/todo/${id}`);
}

export async function updateTodo(
  id: string,
  text: string,
): Promise<Todo | null> {
  const supabase = await createServer();
  // Fetch todo to get userTodoId
  const { data: todo, error: fetchError } = await supabase
    .from("todos")
    .select("user_todo_id")
    .eq("id", id)
    .single();

  if (fetchError || !todo) {
    return null;
  }

  const { data, error: updateError } = await supabase
    .from("todos")
    .update({ text })
    .eq("id", id)
    .select()
    .single();

  if (updateError || !data) {
    throw updateError || new Error("Failed to update todo");
  }

  revalidatePath(`/todo/${todo.user_todo_id}`);
  return data;
}
