"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface JoinListFormProps {
  error?: string;
}

export function JoinListForm({ error }: JoinListFormProps) {
  const [todoId, setTodoId] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (error === "invalid_todo_id") {
      toast.error("Invalid Todo ID");
      // Clear the query param without reloading the page
      router.replace("/");
    }
  }, [error, router]);

  return (
    <div className="bg-card flex flex-col gap-3 rounded-lg border p-6">
      <h2 className="text-xl font-semibold">Join an existing Shopping List?</h2>
      <p className="text-muted-foreground text-sm">
        Enter the 6 digits Shopping List Ids for the list you want to join
      </p>
      <div className="flex flex-col items-center justify-center gap-3">
        <InputOTP
          maxLength={6}
          value={todoId}
          onChange={(value) => {
            setTodoId(value);
            if (value.length === 6) {
              router.push(`/todo/${value}`);
            }
          }}
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
      </div>
    </div>
  );
}
