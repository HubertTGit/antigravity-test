import { UserButton } from "@clerk/nextjs";

export default async function TodoPage({ params }: { params: Promise<{ todoId: string }> }) {
  const { todoId } = await params;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-8">
      <div className="absolute top-4 right-4">
        <UserButton />
      </div>
      <h1 className="text-4xl font-bold">Todo List</h1>
      <p className="text-xl">Todo ID: {todoId}</p>
      <p className="text-muted-foreground">This page is public and shareable.</p>
    </div>
  );
}
