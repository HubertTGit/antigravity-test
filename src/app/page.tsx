'use client';

import { SignInButton, useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { getOrCreateUser } from '@/lib/user-service';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';

export default function Home() {
  const [todoId, setTodoId] = useState('');
  const router = useRouter();
  const { user, isLoaded } = useUser();

  // Check if user is authenticated and redirect to their todo page
  // Check if user is authenticated and redirect to their todo page
  useEffect(() => {
    const initUser = async () => {
      if (isLoaded && user) {
        try {
          const dbUser = await getOrCreateUser(user.id);
          router.push(`/todo/${dbUser.userTodoId}`);
        } catch (error) {
          console.error('Error initializing user:', error);
          toast.error('Failed to set up your account. Please try again.');
        }
      }
    };
    initUser();
  }, [isLoaded, user, router]);

  const handleTodoIdSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!todoId.trim()) {
      toast.error('Please enter a valid Todo ID');
      return;
    }

    // Since we don't have a database to validate against,
    // we'll accept any non-empty todoId and redirect
    // In a real app, you would validate against your database here
    router.push(`/todo/${todoId.trim()}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-4xl font-bold text-center">Share your Todos</h1>

      <div className="flex flex-col gap-6 w-full max-w-md">
        {/* Sign In Option */}
        <div className="flex flex-col gap-3 p-6 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold">New User?</h2>
          <p className="text-sm text-muted-foreground">
            Sign in to create your personal Todo List
          </p>
          <SignInButton mode="modal">
            <Button className="w-full" size="lg">
              Sign In
            </Button>
          </SignInButton>
        </div>

        {/* Existing User ID Option */}
        <div className="flex flex-col gap-3 p-6 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold">Join an existing List?</h2>
          <p className="text-sm text-muted-foreground">
            Enter the 6 digits todo Ids for the list you want to join
          </p>
          <form onSubmit={handleTodoIdSubmit} className="flex flex-col gap-3 justify-center items-center">
            <InputOTP maxLength={6}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
              </InputOTPGroup>
              <InputOTPGroup>
                <InputOTPSlot index={1} />
              </InputOTPGroup>
              <InputOTPGroup>
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPGroup>
                <InputOTPSlot index={3} />
              </InputOTPGroup>
              <InputOTPGroup>
                <InputOTPSlot index={4} />
              </InputOTPGroup>
              <InputOTPGroup>
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <Button
              type="submit"
              variant="outline"
              size="lg"
              className="w-full"
            >
              Access Todo List
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
