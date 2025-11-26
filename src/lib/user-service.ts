"use server";

import { db } from "./db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getOrCreateUser(userId: string, name?: string) {
  // 1. Check if user exists
  const existingUser = await db.query.users.findFirst({
    where: eq(users.userId, userId),
  });

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
      const newUser = await db
        .insert(users)
        .values({
          userId,
          userTodoId,
          name: fullName,
        })
        .returning();

      return newUser[0];
    } catch (error: any) {
      // Check for unique constraint violation on userTodoId
      // Postgres error code 23505 is unique_violation
      if (
        error.code === "23505" &&
        error.constraint?.includes("user_todo_id")
      ) {
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
