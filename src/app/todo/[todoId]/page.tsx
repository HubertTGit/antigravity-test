import ErrorNotifier from "@/components/error-notifier";
import { TodoList } from "@/components/todo-list";
import { createServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function TodoPage({
  params,
}: {
  params: Promise<{ todoId: string }>;
}) {
  const { todoId } = await params;
  const supabase = await createServer();

  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .eq("user_todo_id", todoId)
    .order("created_at", { ascending: false });

  if (data?.length === 0 || error) {
    redirect("/error?error=invalid_todo_id");
  }

  return (
    <>
      <TodoList todoId={todoId} />
    </>
  );
}
