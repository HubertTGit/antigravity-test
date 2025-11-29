"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useUser } from "@/lib/auth-context";
import Link from "next/link";
import { getOrCreateUser } from "@/lib/user-service";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

function HomeContent() {
  const [todoId, setTodoId] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "invalid_todo_id") {
      toast.error("Invalid Todo ID");
      // Optional: Clear the query param
      router.replace("/");
    }
  }, [searchParams, router]);

  // Check if user is authenticated and redirect to their todo page
  useEffect(() => {
    const initUser = async () => {
      if (isLoaded && user) {
        const fullname = user.user_metadata?.name || "none";

        try {
          const dbUser = await getOrCreateUser(user.id, fullname);
          router.push(`/todo/${dbUser.user_todo_id}`);
        } catch (error) {
          console.error("Error initializing user:", error);
          toast.error("Failed to set up your account. Please try again.");
        }
      }
    };
    initUser();
  }, [isLoaded, user, router]);

  const handleTodoIdSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!todoId.trim()) {
      toast.error("Please enter a valid Todo ID");
      return;
    }

    // Since we don't have a database to validate against,
    // we'll accept any non-empty todoId and redirect
    // In a real app, you would validate against your database here
    router.push(`/todo/${todoId.trim()}`);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8 pb-20 sm:p-20">
      <div className="flex w-full max-w-md flex-col gap-6">
        {/* Sign In Option */}
        <div className="bg-card flex flex-col gap-3 rounded-lg border p-6">
          <h2 className="text-xl font-semibold">Start a new Shopping List?</h2>
          <p className="text-muted-foreground text-sm">
            Sign in to create your personal Shopping List
          </p>
          <Link href="/sign-in" className="w-full">
            <Button className="w-full" size="lg">
              Sign In
            </Button>
          </Link>
        </div>

        {/* Existing User ID Option */}
        <div className="bg-card flex flex-col gap-3 rounded-lg border p-6">
          <h2 className="text-xl font-semibold">
            Join an existing Shopping List?
          </h2>
          <p className="text-muted-foreground text-sm">
            Enter the 6 digits Shopping List Ids for the list you want to join
          </p>
          <form
            onSubmit={handleTodoIdSubmit}
            className="flex flex-col items-center justify-center gap-3"
          >
            <InputOTP
              maxLength={6}
              value={todoId}
              onChange={(value) => setTodoId(value)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <Button
              type="submit"
              variant="outline"
              size="lg"
              className="w-full"
            >
              Access Shopping List
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
