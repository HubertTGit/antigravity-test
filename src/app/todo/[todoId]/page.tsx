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
    .from("creators")
    .select("*")
    .eq("user_todo_id", todoId)
    .single();

  if (data?.user_todo_id !== todoId || error) {
    redirect("/?error=invalid_todo_id");
  }

  return (
    <>
      <TodoList todoId={todoId} />
    </>
  );
}
