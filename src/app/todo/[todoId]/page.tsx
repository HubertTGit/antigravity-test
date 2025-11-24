import { UserButton } from "@clerk/nextjs";
import { TodoList } from "@/components/todo-list";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function TodoPage({ params }: { params: Promise<{ todoId: string }> }) {
  const { todoId } = await params;

  const user = await db.query.users.findFirst({
    where: eq(users.userTodoId, todoId),
  });

  if (!user) {
    redirect("/?error=invalid_todo_id");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-8">
      <div className="absolute top-4 right-4">
        <UserButton />
      </div>
      <h1 className="text-4xl font-bold">Todo List</h1>
      <p className="text-xl">Todo ID: {todoId}</p>
      <p className="text-muted-foreground">This page is public and shareable.</p>
      <TodoList todoId={todoId} />
    </div>
  );
}
