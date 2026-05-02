import { useCallback } from "react";

interface ToastProps {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

export function useToast() {
  const toast = useCallback((props: ToastProps) => {
    // For now, just log to console
    // In production, integrate with shadcn toast
    console.log("Toast:", props);
  }, []);

  return { toast };
}
