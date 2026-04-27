"use client";

import { useSyncUser } from "@/lib/hooks/useSyncUser";

/**
 * Client wrapper component for syncing user from Supabase
 * This component handles all client-side initialization
 */
export function ClientProviders({ children }: { children: React.ReactNode }) {
  // Sync user from Supabase to Zustand store
  useSyncUser();

  return <>{children}</>;
}
