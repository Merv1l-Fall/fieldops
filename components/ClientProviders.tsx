"use client";

import { useSyncUser } from "@/lib/hooks/useSyncUser";
import { ToastProvider } from "@/lib/context/toast-context";
import { ToastContainer } from "@/components/ui/toast-container";

/**
 * Client wrapper component for syncing user from Supabase
 * This component handles all client-side initialization
 */
export function ClientProviders({ children }: { children: React.ReactNode }) {
  // Sync user from Supabase to Zustand store
  useSyncUser();

  return (
    <ToastProvider>
      {children}
      <ToastContainer />
    </ToastProvider>
  );
}
