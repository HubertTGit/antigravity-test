import { UserButton } from '@clerk/nextjs';
import { TodoList } from '@/components/todo-list';
import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export default async function TodoPage({
  params,
}: {
  params: Promise<{ todoId: string }>;
}) {
  const { todoId } = await params;

  const user = await db.query.users.findFirst({
    where: eq(users.userTodoId, todoId),
  });

  if (!user) {
    redirect('/?error=invalid_todo_id');
  }

  return (
    <>
      <TodoList todoId={todoId} />
    </>
  );
}
