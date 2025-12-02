import { TodoList } from "@/components/todo-list";
import { redirect } from "next/navigation";

import { Suspense } from "react";
import { getTodos } from "@/app/actions";
import { Todo } from "@/types/todo";
import { Skeleton } from "@/components/ui/skeleton";

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
    <Suspense
      fallback={
        <div className="mx-4">
          <div className="bg-background/95 sticky top-0 z-20 mx-auto w-full max-w-2xl space-y-4 py-4">
            <div className="flex justify-between gap-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-12 flex-1 rounded-lg" />
              <Skeleton className="h-12 w-12 shrink-0" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-9 w-16" />
              <Skeleton className="h-9 w-16" />
              <Skeleton className="h-9 w-16" />
            </div>
          </div>
          <div className="mx-auto my-4 w-full max-w-2xl space-y-2">
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
          </div>
        </div>
      }
    >
      <TodoFetcher todoId={todoId} />
    </Suspense>
  );
}
