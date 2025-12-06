import { Button } from "./ui/button";
import { RotateCw } from "lucide-react";
import { ReactElement } from "react";

const ReloadButton = ({
  show = false,
}: {
  show?: boolean;
}): ReactElement | null => {
  if (!show) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => window.location.reload()}
      title="Reload page"
    >
      <RotateCw className="h-[1.2rem] w-[1.2rem]" />
      <span className="sr-only">Reload page</span>
    </Button>
  );
};

export default ReloadButton;
