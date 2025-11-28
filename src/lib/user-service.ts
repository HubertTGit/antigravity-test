"use server";

import { supabase } from "./db";

export async function getOrCreateUser(userId: string, name?: string) {
  const { data: existingUser, error: fetchError } = await supabase
    .from("creators")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (existingUser) {
    return existingUser;
  }

  // 2. Generate unique 6-digit userTodoId
  let attempts = 0;
  const maxAttempts = 5;

  const fullName = name || "none";

  while (attempts < maxAttempts) {
    const userTodoId = Math.floor(100000 + Math.random() * 900000).toString();

    try {
      // 3. Insert new user record
      const { data: newUser, error: insertError } = await supabase
        .from("creators")
        .insert({
          user_id: userId,
          user_todo_id: userTodoId,
          name: fullName,
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      return newUser;
    } catch (error: any) {
      // Check for unique constraint violation on userTodoId
      // Postgres error code 23505 is unique_violation
      if (error.code === "23505" && error.message?.includes("user_todo_id")) {
        attempts++;
        continue;
      }
      throw error;
    }
  }

  throw new Error(
    "Failed to generate unique userTodoId after multiple attempts",
  );
}
