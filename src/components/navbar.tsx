"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "./ui/button";
import { useUser } from "@/lib/auth-context";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactElement } from "react";

function ExitButton({ show = false }: { show?: boolean }): ReactElement | null {
  if (!show) return null;

  return (
    <Button>
      <Link href="/">Exit</Link>
    </Button>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const { isSignedIn } = useUser();

  return (
    <header className="bg-background/95 sticky top-0 z-10 w-full border-b pt-[env(safe-area-inset-top)] backdrop-blur">
      <nav className="flex h-14 w-full items-center justify-between px-4">
        <ExitButton show={!isSignedIn && pathname.includes("todo")} />

        <h1 className="text-2xl font-bold">Shopping List</h1>
        <ThemeToggle />
      </nav>
    </header>
  );
}
