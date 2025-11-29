"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/lib/auth-context";
import { toast } from "sonner";

export function UserMenu() {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (user && user.user_metadata?.avatar_url) {
      setImgUrl(user?.user_metadata?.avatar_url);
    }
  }, [user]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error("Failed to sign out");
      return;
    }

    toast.success("Signed out successfully");
    router.push("/");
    router.refresh();
  };

  if (!user) return null;

  const displayName =
    user.user_metadata?.name || user.email?.split("@")[0] || "User";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
        aria-label="User menu"
      >
        {imgUrl ? (
          <img src={imgUrl} alt="User" className="h-8 w-8 rounded-full" />
        ) : (
          initials
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="ring-opacity-5 absolute left-0 z-20 mt-2 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black focus:outline-none dark:bg-gray-800">
            <div className="px-4 py-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {displayName}
              </p>
              <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                {user.email}
              </p>
            </div>
            <div className="border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={handleSignOut}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Sign out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
