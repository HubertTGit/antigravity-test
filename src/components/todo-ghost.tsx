import { FC } from "react";
import { Skeleton } from "./ui/skeleton";

const TodoGhost: FC = () => {
  return (
    <div className="mx-4">
      <div className="bg-background/95 sticky top-0 z-20 mx-auto w-full max-w-2xl space-y-4 py-4">
        <div className="flex justify-between gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-12 flex-1 rounded-lg" />
          <Skeleton className="h-12 w-12 shrink-0" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-16" />
          <Skeleton className="h-9 w-16" />
          <Skeleton className="h-9 w-16" />
        </div>
      </div>
      <div className="mx-auto my-4 w-full max-w-2xl space-y-2">
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
      </div>
    </div>
  );
};

export default TodoGhost;
