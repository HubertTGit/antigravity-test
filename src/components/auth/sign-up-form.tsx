"use client";

import { useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FcGoogle } from "react-icons/fc";

export function SignUpForm() {
  const [isGooglePending, startGoogleTransition] = useTransition();
  const supabase = createClient();

  const handleGoogleSignIn = async () => {
    startGoogleTransition(async () => {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        toast.error(error.message);
      }
    });
  };

  return (
    <div className="space-y-4">
      <Button
        variant="outline"
        className="flex w-full items-center gap-2"
        onClick={handleGoogleSignIn}
        disabled={isGooglePending}
      >
        <FcGoogle className="h-5 w-5" />
        Sign up with Google
      </Button>
    </div>
  );
}
