"use client";

import { FC, useEffect } from "react";
import { toast } from "sonner";

const ErrorNotifier: FC<{ error: string }> = ({ error }) => {
  useEffect(() => {
    toast.error(error);
  }, [error]);

  return <></>;
};

export default ErrorNotifier;
