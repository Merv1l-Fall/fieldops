import { useEffect } from "react";
import { createClient } from "@/lib/client";
import { useUserStore } from "@/lib/store/userStore";

/**
 * Hook to sync user from Supabase with Zustand store
 * Listens for real-time auth state changes
 */
export function useSyncUser() {
  const { setUser, setIsLoading } = useUserStore();

  useEffect(() => {
    async function getUser() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setUser({
            id: user.id,
            email: user.email || "",
            full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "",
            avatar_url: user.user_metadata?.avatar_url,
            created_at: user.created_at,
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      }
    }

    // Get user on mount
    getUser();

    // Listen for auth state changes
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || "",
          full_name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "",
          avatar_url: session.user.user_metadata?.avatar_url,
          created_at: session.user.created_at,
        });
      } else {
        setUser(null);
      }
    });

    // Cleanup subscription
    return () => {
      subscription?.unsubscribe();
    };
  }, [setUser, setIsLoading]);
}
