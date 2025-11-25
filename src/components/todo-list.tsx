"use client";

import { useState, useEffect, useTransition } from "react";
import { Todo } from "@/types/todo";
import { TodoItem } from "@/components/todo-item";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTodos, addTodo, toggleTodo, deleteTodo, updateTodo, deleteCompletedTodos } from "@/app/actions";

export function TodoList({ todoId }: { todoId?: string }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isPending, startTransition] = useTransition();
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  useEffect(() => {
    if (todoId) {
      getTodos(todoId).then((fetchedTodos) => {
        // Map database fields to Todo type if necessary, assuming schema matches
        // The schema has createdAt as Date, Todo type likely expects number or string?
        // Let's check Todo type. For now assuming it's compatible or I'll fix it.
        // Schema: id (number), text, completed, userId, createdAt (Date)
        // Todo type likely: id (string), text, completed, createdAt (number)
        // I need to adapt the data.
        const adaptedTodos: Todo[] = fetchedTodos.map(t => ({
          id: t.id.toString(),
          text: t.text,
          completed: t.completed,
          createdAt: t.createdAt.getTime()
        }));
        setTodos(adaptedTodos);
      });
    }
  }, [todoId]);

  const handleAddTodo = async () => {
    if (!inputValue.trim() || !todoId) return;

    const text = inputValue.trim();
    setInputValue("");

    // Optimistic update
    const tempId = Date.now().toString();
    const newTodo: Todo = {
      id: tempId,
      text: text,
      completed: false,
      createdAt: Date.now(),
    };
    setTodos((prev) => [newTodo, ...prev]);

    startTransition(async () => {
      await addTodo(todoId, text);
      // Refresh list to get real ID
      const fetchedTodos = await getTodos(todoId);
      const adaptedTodos: Todo[] = fetchedTodos.map(t => ({
        id: t.id.toString(),
        text: t.text,
        completed: t.completed,
        createdAt: t.createdAt.getTime()
      }));
      setTodos(adaptedTodos);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTodo();
    }
  };

  const handleToggleTodo = async (id: string) => {
    // Optimistic
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );

    startTransition(async () => {
      await toggleTodo(id);
    });
  };

  const handleDeleteTodo = async (id: string) => {
    // Optimistic
    setTodos((prev) => prev.filter((todo) => todo.id !== id));

    startTransition(async () => {
      await deleteTodo(id);
    });
  };

  const handleUpdateTodo = async (id: string, newText: string) => {
    // Optimistic
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, text: newText } : todo))
    );

    startTransition(async () => {
      await updateTodo(id, newText);
    });
  };

  const handleDeleteCompleted = async () => {
    if (!todoId) return;

    // Optimistic
    setTodos((prev) => prev.filter((todo) => !todo.completed));

    startTransition(async () => {
      await deleteCompletedTodos(todoId);
    });
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a new task..."
          className="flex-1 h-12 px-4 rounded-lg border border-input bg-background shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground"
        />
        <Button onClick={handleAddTodo} size="icon" className="h-12 w-12 shrink-0" disabled={isPending || !todoId}>
          <Plus className="h-6 w-6" />
          <span className="sr-only">Add Todo</span>
        </Button>
      </div>

      <div className="flex gap-2 justify-center">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
          size="sm"
        >
          All
        </Button>
        <Button
          variant={filter === "active" ? "default" : "outline"}
          onClick={() => setFilter("active")}
          size="sm"
        >
          Active
        </Button>
        <Button
          variant={filter === "completed" ? "default" : "outline"}
          onClick={() => setFilter("completed")}
          size="sm"
        >
          Completed
        </Button>
      </div>

      {todos.some((todo) => todo.completed) && (
        <div className="flex justify-center">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDeleteCompleted}
            disabled={isPending}
          >
            Delete Completed
          </Button>
        </div>
      )}

      <div className="space-y-2">
        {filteredTodos.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>
              {filter === "all"
                ? "No tasks yet. Add one above!"
                : filter === "active"
                  ? "No active tasks!"
                  : "No completed tasks!"}
            </p>
          </div>
        ) : (
          filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggleTodo}
              onDelete={handleDeleteTodo}
              onUpdate={handleUpdateTodo}
            />
          ))
        )}
      </div>
    </div>
  );
}
