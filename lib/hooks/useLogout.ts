import { useRouter } from "next/navigation";
import { createClient } from "@/lib/client";
import { useUserStore } from "@/lib/store/userStore";

/**
 * Hook for logging out the user
 */
export function useLogout() {
  const router = useRouter();
  const { clearUser } = useUserStore();

  const logout = async () => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Logout error:", error.message);
        return false;
      }

      // Clear user from store
      clearUser();

      // Redirect to login
      router.push("/login");
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      return false;
    }
  };

  return { logout };
}
