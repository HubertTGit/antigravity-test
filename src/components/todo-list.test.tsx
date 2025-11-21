import { render, screen, fireEvent } from "@testing-library/react";
import { TodoList } from "./todo-list";

// Mock localStorage
const localStorageMock = (function () {
  let store: Record<string, string> = {};
  return {
    getItem: function (key: string) {
      return store[key] || null;
    },
    setItem: function (key: string, value: string) {
      store[key] = value.toString();
    },
    clear: function () {
      store = {};
    },
    removeItem: function (key: string) {
      delete store[key];
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("TodoList", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders empty state initially", () => {
    render(<TodoList />);
    expect(screen.getByText("No tasks yet. Add one above!")).toBeInTheDocument();
  });

  it("adds a new todo", () => {
    render(<TodoList />);
    const input = screen.getByPlaceholderText("Add a new task...");
    const addButton = screen.getByRole("button", { name: /add todo/i });

    fireEvent.change(input, { target: { value: "New Task" } });
    fireEvent.click(addButton);

    expect(screen.getByText("New Task")).toBeInTheDocument();
  });

  it("toggles a todo", () => {
    render(<TodoList />);
    const input = screen.getByPlaceholderText("Add a new task...");
    const addButton = screen.getByRole("button", { name: /add todo/i });

    fireEvent.change(input, { target: { value: "Task to toggle" } });
    fireEvent.click(addButton);

    const toggleButton = screen.getByRole("button", { name: /mark as complete/i });
    fireEvent.click(toggleButton);

    expect(screen.getByLabelText("Mark as incomplete")).toBeInTheDocument();
  });

  it("deletes a todo", () => {
    render(<TodoList />);
    const input = screen.getByPlaceholderText("Add a new task...");
    const addButton = screen.getByRole("button", { name: /add todo/i });

    fireEvent.change(input, { target: { value: "Task to delete" } });
    fireEvent.click(addButton);

    const deleteButton = screen.getByRole("button", { name: /delete todo/i });
    fireEvent.click(deleteButton);

    expect(screen.queryByText("Task to delete")).not.toBeInTheDocument();
  });
  it("filters todos", () => {
    render(<TodoList />);
    const input = screen.getByPlaceholderText("Add a new task...");
    const addButton = screen.getByRole("button", { name: /add todo/i });

    // Add active task
    fireEvent.change(input, { target: { value: "Active Task" } });
    fireEvent.click(addButton);

    // Add completed task
    fireEvent.change(input, { target: { value: "Completed Task" } });
    fireEvent.click(addButton);
    const toggleButtons = screen.getAllByRole("button", { name: /mark as complete/i });
    fireEvent.click(toggleButtons[0]); // Toggle the second added task (which is now first in list)

    // Filter by Active
    const activeFilter = screen.getByRole("button", { name: /active/i });
    fireEvent.click(activeFilter);
    expect(screen.getByText("Active Task")).toBeInTheDocument();
    expect(screen.queryByText("Completed Task")).not.toBeInTheDocument();

    // Filter by Completed
    const completedFilter = screen.getByRole("button", { name: /completed/i });
    fireEvent.click(completedFilter);
    expect(screen.getByText("Completed Task")).toBeInTheDocument();
    expect(screen.queryByText("Active Task")).not.toBeInTheDocument();

    // Filter by All
    const allFilter = screen.getByRole("button", { name: /all/i });
    fireEvent.click(allFilter);
    expect(screen.getByText("Active Task")).toBeInTheDocument();
    expect(screen.getByText("Completed Task")).toBeInTheDocument();
  });
});
