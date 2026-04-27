import { create } from "zustand";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string | null;
  created_at?: string | null;
  role?: string | null;
}

interface UserStore {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user, isLoading: false }),
  setIsLoading: (isLoading) => set({ isLoading }),
  clearUser: () => set({ user: null, isLoading: false }),
}));
