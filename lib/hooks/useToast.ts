"use client";

import { useContext } from "react";
import { ToastContext } from "@/lib/context/toast-context";

interface ToastProps {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }

  const toast = (props: ToastProps) => {
    context.addToast({
      title: props.title,
      description: props.description,
      variant: props.variant ?? "default",
      duration: props.duration,
    });
  };

  return { toast };
}
