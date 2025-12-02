"use client";

import { useState, useEffect, useTransition, useRef } from "react";
import { Todo } from "@/types/todo";
import { TodoItem } from "@/components/todo-item";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getTodos,
  addTodo,
  toggleTodo,
  deleteTodo,
  updateTodo,
  deleteCompletedTodos,
  toggleAllTodos,
} from "@/app/actions";
import { Checkbox } from "@/components/ui/checkbox";
import { createClient } from "@/lib/supabase/client";
import { usePathname } from "next/navigation";
import { useUser } from "@/lib/auth-context";
import { ShareButton } from "./share-button";

interface TodoListProps {
  todoId?: string;
}

export function TodoList({ todoId }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isPending, startTransition] = useTransition();
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const pathname = usePathname();

  const { isSignedIn } = useUser();

  // Generate unique client session ID to track self-generated changes
  const [clientSessionId] = useState(
    () => `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  );
  const pendingActionsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!todoId) return;

    // Initial fetch
    getTodos(todoId).then((fetchedTodos) => {
      const adaptedTodos: Todo[] = fetchedTodos.map((t) => ({
        id: t.id.toString(),
        text: t.text,
        completed: t.completed,
        created_at: t.created_at,
      }));
      setTodos(adaptedTodos);
    });

    // Set up realtime subscription
    const supabase = createClient();
    const channel = supabase
      .channel(`todos:${todoId}`)
      .on(
        "broadcast",
        { event: "todo-change" },
        ({
          payload: broadcast,
        }: {
          payload: {
            type: string;
            payload: Todo | { id: string } | null;
            clientSessionId: string;
          };
        }) => {
          // Ignore events from this client session
          if (broadcast.clientSessionId === clientSessionId) {
            return;
          }

          // Handle changes from other clients
          if (
            broadcast.type === "INSERT" &&
            broadcast.payload &&
            "text" in broadcast.payload
          ) {
            const newTodo: Todo = {
              id: broadcast.payload.id.toString(),
              text: broadcast.payload.text,
              completed: broadcast.payload.completed,
              created_at: broadcast.payload.created_at,
            };
            setTodos((prev) => {
              // Avoid duplicates
              if (prev.some((t) => t.id === newTodo.id)) return prev;
              return [newTodo, ...prev];
            });
          } else if (
            broadcast.type === "UPDATE" &&
            broadcast.payload &&
            "text" in broadcast.payload
          ) {
            const updatedTodo: Todo = {
              id: broadcast.payload.id.toString(),
              text: broadcast.payload.text,
              completed: broadcast.payload.completed,
              created_at: broadcast.payload.created_at,
            };
            setTodos((prev) =>
              prev.map((todo) =>
                todo.id === updatedTodo.id ? updatedTodo : todo,
              ),
            );
          } else if (
            broadcast.type === "DELETE" &&
            broadcast.payload &&
            "id" in broadcast.payload
          ) {
            const deletedId = broadcast.payload.id.toString();
            setTodos((prev) => prev.filter((todo) => todo.id !== deletedId));
          } else if (broadcast.type === "DELETE_COMPLETED") {
            setTodos((prev) => prev.filter((todo) => !todo.completed));
          } else if (
            broadcast.type === "TOGGLE_ALL" &&
            broadcast.payload &&
            "completed" in broadcast.payload
          ) {
            const completed = (broadcast.payload as { completed: boolean })
              .completed;
            setTodos((prev) =>
              prev.map((todo) => ({
                ...todo,
                completed,
              })),
            );
          }
        },
      )
      .subscribe();

    // Cleanup
    return () => {
      supabase.removeChannel(channel);
    };
  }, [todoId, clientSessionId]);

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
      created_at: new Date().toISOString(),
    };
    setTodos((prev) => [newTodo, ...prev]);

    startTransition(async () => {
      const result = await addTodo(todoId, text);

      // Replace temp ID with real ID from server
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === tempId
            ? {
                id: result.id,
                text: result.text,
                completed: result.completed,
                created_at: result.created_at,
              }
            : todo,
        ),
      );

      // Broadcast change to other clients
      const supabase = createClient();
      const channel = supabase.channel(`todos:${todoId}`);
      await channel.send({
        type: "broadcast",
        event: "todo-change",
        payload: {
          type: "INSERT",
          payload: result,
          clientSessionId: clientSessionId,
        },
      });

      // Mark this action as handled
      pendingActionsRef.current.add(`INSERT-${result.id}`);
      setTimeout(
        () => pendingActionsRef.current.delete(`INSERT-${result.id}`),
        1000,
      );
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
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );

    startTransition(async () => {
      const result = await toggleTodo(id);

      // Broadcast change to other clients
      if (result && todoId) {
        const supabase = createClient();
        const channel = supabase.channel(`todos:${todoId}`);
        await channel.send({
          type: "broadcast",
          event: "todo-change",
          payload: {
            type: "UPDATE",
            payload: result,
            clientSessionId: clientSessionId,
          },
        });

        pendingActionsRef.current.add(`UPDATE-${result.id}`);
        setTimeout(
          () => pendingActionsRef.current.delete(`UPDATE-${result.id}`),
          1000,
        );
      }
    });
  };

  const handleDeleteTodo = async (id: string) => {
    // Optimistic
    setTodos((prev) => prev.filter((todo) => todo.id !== id));

    startTransition(async () => {
      await deleteTodo(id);

      // Broadcast change to other clients
      if (todoId) {
        const supabase = createClient();
        const channel = supabase.channel(`todos:${todoId}`);
        await channel.send({
          type: "broadcast",
          event: "todo-change",
          payload: {
            type: "DELETE",
            payload: { id },
            clientSessionId: clientSessionId,
          },
        });

        pendingActionsRef.current.add(`DELETE-${id}`);
        setTimeout(
          () => pendingActionsRef.current.delete(`DELETE-${id}`),
          1000,
        );
      }
    });
  };

  const handleUpdateTodo = async (id: string, newText: string) => {
    // Optimistic
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, text: newText } : todo)),
    );

    startTransition(async () => {
      const result = await updateTodo(id, newText);

      // Broadcast change to other clients
      if (result && todoId) {
        const supabase = createClient();
        const channel = supabase.channel(`todos:${todoId}`);
        await channel.send({
          type: "broadcast",
          event: "todo-change",
          payload: {
            type: "UPDATE",
            payload: result,
            clientSessionId: clientSessionId,
          },
        });

        pendingActionsRef.current.add(`UPDATE-${result.id}`);
        setTimeout(
          () => pendingActionsRef.current.delete(`UPDATE-${result.id}`),
          1000,
        );
      }
    });
  };

  const handleDeleteCompleted = async () => {
    if (!todoId) return;

    // Optimistic
    setTodos((prev) => prev.filter((todo) => !todo.completed));

    startTransition(async () => {
      await deleteCompletedTodos(todoId);

      // Broadcast change to other clients
      const supabase = createClient();
      const channel = supabase.channel(`todos:${todoId}`);
      await channel.send({
        type: "broadcast",
        event: "todo-change",
        payload: {
          type: "DELETE_COMPLETED",
          payload: null,
          clientSessionId: clientSessionId,
        },
      });
    });
  };

  const handleToggleAll = async () => {
    if (!todoId || todos.length === 0) return;

    const allCompleted = todos.every((t) => t.completed);
    const newCompletedStatus = !allCompleted;

    // Optimistic update
    setTodos((prev) =>
      prev.map((todo) => ({ ...todo, completed: newCompletedStatus })),
    );

    startTransition(async () => {
      await toggleAllTodos(todoId, newCompletedStatus);

      // Broadcast change to other clients
      const supabase = createClient();
      const channel = supabase.channel(`todos:${todoId}`);
      await channel.send({
        type: "broadcast",
        event: "todo-change",
        payload: {
          type: "TOGGLE_ALL",
          payload: { completed: newCompletedStatus },
          clientSessionId: clientSessionId,
        },
      });
    });
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  return (
    <div className="mx-4">
      <div className="bg-background/95 sticky top-0 z-20 mx-auto w-full max-w-2xl space-y-4 py-4">
        <div className="flex justify-between gap-2">
          <ShareButton show={isSignedIn && pathname !== "/"} todoId={todoId} />
          <div></div>

          <div className="flex justify-center">
            {isSignedIn && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteCompleted}
                disabled={isPending || !todos.some((todo) => todo.completed)}
              >
                Delete ({todos.filter((t) => t.completed).length})
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a new shopping item..."
            className="border-input bg-background focus-visible:ring-ring placeholder:text-muted-foreground h-12 flex-1 rounded-lg border px-4 shadow-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
          />
          <Button
            onClick={handleAddTodo}
            size="icon"
            className="h-12 w-12 shrink-0"
            disabled={isPending || !todoId}
          >
            <Plus className="h-6 w-6" />
            <span className="sr-only">Add Todo</span>
          </Button>
        </div>

        <div className="flex gap-2">
          <div className="flex gap-2">
            <div className="bg-background flex items-center space-x-2 rounded-md border px-3">
              <Checkbox
                id="toggle-all"
                checked={todos.length > 0 && todos.every((t) => t.completed)}
                onCheckedChange={handleToggleAll}
                disabled={todos.length === 0 || isPending}
              />
            </div>
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
              Active ({todos.filter((t) => !t.completed).length})
            </Button>
            <Button
              variant={filter === "completed" ? "default" : "outline"}
              onClick={() => setFilter("completed")}
              size="sm"
            >
              Completed ({todos.filter((t) => t.completed).length})
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto my-4 w-full max-w-2xl space-y-2">
        {filteredTodos.length === 0 ? (
          <div className="text-muted-foreground py-12 text-center">
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
              isSignedIn={isSignedIn}
            />
          ))
        )}
      </div>
    </div>
  );
}
