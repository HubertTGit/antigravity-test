"use client";

import { SignInButton, useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [userId, setUserId] = useState("");
  const router = useRouter();
  const { user, isLoaded } = useUser();

  // Check if user is authenticated and redirect to their user page
  useEffect(() => {
    if (isLoaded && user) {
      router.push(`/user/${user.id}`);
    }
  }, [isLoaded, user, router]);

  const handleUserIdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId.trim()) {
      toast.error("Please enter a valid User ID");
      return;
    }

    // Since we don't have a database to validate against,
    // we'll accept any non-empty userId and redirect
    // In a real app, you would validate against your database here
    router.push(`/user/${userId.trim()}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-4xl font-bold text-center">Welcome to Antigravity</h1>
      
      <div className="flex flex-col gap-6 w-full max-w-md">
        {/* Sign In Option */}
        <div className="flex flex-col gap-3 p-6 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold">New User?</h2>
          <p className="text-sm text-muted-foreground">
            Sign in to create your personal todo list
          </p>
          <SignInButton mode="modal">
            <Button className="w-full" size="lg">
              Sign In
            </Button>
          </SignInButton>
        </div>

        {/* Existing User ID Option */}
        <div className="flex flex-col gap-3 p-6 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold">Existing User?</h2>
          <p className="text-sm text-muted-foreground">
            View existing Todo List
          </p>
          <form onSubmit={handleUserIdSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter User ID"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <Button type="submit" variant="outline" size="lg" className="w-full">
              Access Todo List
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
