import { useEffect } from "react";
import { createClient } from "@/lib/client";
import { useUserStore } from "@/lib/store/userStore";

/**
 * Hook to sync user from Supabase with Zustand store
 * Call this in your root layout or main app component
 */
export function useSyncUser() {
  const { setUser, setIsLoading } = useUserStore();

  useEffect(() => {
    async function getUser() {
      try {
        const supabase = await createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setUser({
            id: user.id,
            email: user.email || "",
            name: user.user_metadata?.name || user.email?.split("@")[0] || "",
            avatar_url: user.user_metadata?.avatar_url,
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      }
    }

    getUser();
  }, [setUser, setIsLoading]);
}
