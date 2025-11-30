import { ReactElement } from "react";
import { UserMenu } from "./user-menu";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Share2 } from "lucide-react";

export function ShareButton({
  show = false,
  todoId,
}: {
  show?: boolean;
  todoId?: string;
}): ReactElement | null {
  if (!show) return null;

  return (
    <div className="flex items-center gap-2">
      <UserMenu />
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
