import { TodoList } from "@/components/todo-list";
import { redirect } from "next/navigation";

import { Suspense } from "react";
import { getTodos } from "@/app/actions";
import { Todo } from "@/types/todo";
import { Skeleton } from "@/components/ui/skeleton";
import TodoGhost from "@/components/todo-ghost";

async function TodoFetcher({ todoId }: { todoId: string }) {
  const fetchedTodos = await getTodos(todoId);

  if (fetchedTodos.length === 0) {
    redirect("/error?error=invalid_todo_id");
  }

  const adaptedTodos: Todo[] = fetchedTodos.map((t) => ({
    id: t.id.toString(),
    text: t.text,
    completed: t.completed,
    created_at: t.created_at,
  }));

  return <TodoList todoId={todoId} initialTodos={adaptedTodos} />;
}

export default async function TodoPage({
  params,
}: {
  params: Promise<{ todoId: string }>;
}) {
  const { todoId } = await params;

  return (
    <Suspense fallback={<TodoGhost />}>
      <TodoFetcher todoId={todoId} />
    </Suspense>
  );
}
