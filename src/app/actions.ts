"use server";

import { supabase } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getTodos(userId: string) {
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

export async function addTodo(todoId: string, text: string) {
  const { error } = await supabase.from("todos").insert({
    text,
    user_todo_id: todoId,
  });

  if (error) {
    throw error;
  }

  revalidatePath(`/todo/${todoId}`);
}

export async function toggleTodo(id: string) {
  // Fetch current todo to get completed state and userTodoId
  const { data: todo, error: fetchError } = await supabase
    .from("todos")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !todo) {
    return;
  }

  const { error: updateError } = await supabase
    .from("todos")
    .update({ completed: !todo.completed })
    .eq("id", id);

  if (updateError) {
    throw updateError;
  }

  revalidatePath(`/todo/${todo.user_todo_id}`);
}

export async function deleteTodo(id: string) {
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

export async function deleteCompletedTodos(userId: string) {
  const { error } = await supabase
    .from("todos")
    .delete()
    .eq("user_todo_id", userId)
    .eq("completed", true);

  if (error) {
    throw error;
  }

  revalidatePath(`/todo/${userId}`);
}

export async function updateTodo(id: string, text: string) {
  // Fetch todo to get userTodoId
  const { data: todo, error: fetchError } = await supabase
    .from("todos")
    .select("user_todo_id")
    .eq("id", id)
    .single();

  if (fetchError || !todo) {
    return;
  }

  const { error: updateError } = await supabase
    .from("todos")
    .update({ text })
    .eq("id", id);

  if (updateError) {
    throw updateError;
  }

  revalidatePath(`/todo/${todo.user_todo_id}`);
}
