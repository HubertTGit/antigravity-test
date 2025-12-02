"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUser } from "@/lib/auth-context";
import { getOrCreateUser } from "@/lib/user-service";

export function AuthRedirect() {
  const router = useRouter();
  const { user, isLoaded } = useUser();

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

  return null;
}
