import { TodoList } from "@/components/todo-list";
import { supabase } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function TodoPage({
  params,
}: {
  params: Promise<{ todoId: string }>;
}) {
  const { todoId } = await params;

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("user_todo_id", todoId)
    .single();

  if (!user || error) {
    redirect("/?error=invalid_todo_id");
  }

  return (
    <>
      <TodoList todoId={todoId} />
    </>
  );
}
