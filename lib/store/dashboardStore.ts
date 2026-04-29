import { create } from "zustand";

export type DashboardTab = "dashboard" | "booked-ops" | "favorite-fields" | "explore-games";

interface DashboardStore {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedBookingId: string | null;
  setSelectedBookingId: (id: string | null) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  activeTab: "dashboard",
  setActiveTab: (tab) => set({ activeTab: tab }),
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
  selectedBookingId: null,
  setSelectedBookingId: (id) => set({ selectedBookingId: id }),
}));
