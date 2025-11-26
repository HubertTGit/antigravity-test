"use client";

import {
  UserButton,
  SignedIn,
  SignedOut,
  SignInButton,
  useAuth,
} from "@clerk/nextjs";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "./ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactElement } from "react";
import { toast } from "sonner";
import { Share2 } from "lucide-react";

function ExitButton({ show = false }: { show?: boolean }): ReactElement | null {
  if (!show) return null;

  return (
    <Button>
      <Link href="/">Exit</Link>
    </Button>
  );
}

function ShareButton({
  show = false,
  todoId,
}: {
  show?: boolean;
  todoId?: string;
}): ReactElement | null {
  if (!show) return null;

  return (
    <div className="flex items-center gap-2">
      <SignedIn>
        <UserButton />
      </SignedIn>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          navigator.clipboard.writeText(todoId || "");
          toast(
            "Shopping list ID has been copied to clipboard, you can now paste it to share it with your friends and family",
          );
        }}
      >
        <Share2 className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Share</span>
      </Button>
    </div>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const todoId = pathname.startsWith("/todo/")
    ? pathname.split("/")[2]
    : undefined;

  const { isSignedIn } = useAuth();

  return (
    <header className="bg-background/95 sticky top-0 z-50 w-full border-b pt-[env(safe-area-inset-top)] backdrop-blur">
      <nav className="flex h-14 w-full items-center justify-between px-4">
        <ShareButton show={isSignedIn && pathname !== "/"} todoId={todoId} />

        <ExitButton show={!isSignedIn && pathname !== "/"} />

        <h1 className="text-2xl font-bold">Shopping List</h1>
        <ThemeToggle />
      </nav>
    </header>
  );
}
