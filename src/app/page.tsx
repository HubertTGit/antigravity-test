import { TodoList } from "@/components/todo-list";

export default function Home() {
  return (
    <main className="min-h-screen p-8 md:p-24 bg-background">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-bold tracking-tight">Todo List</h1>
          <p className="text-muted-foreground">
            Stay organized and get things done.
          </p>
        </div>
        
        <TodoList />
      </div>
    </main>
  );
}
