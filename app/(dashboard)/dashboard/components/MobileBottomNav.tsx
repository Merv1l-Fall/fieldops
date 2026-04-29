"use client";

import { Home, Bookmark, Heart, Compass, User } from "lucide-react";
import { useDashboardStore, type DashboardTab } from "@/lib/store/dashboardStore";
import { Button } from "@/components/ui/button";

export function MobileBottomNav() {
  const { activeTab, setActiveTab } = useDashboardStore();

  const tabs: { id: DashboardTab; label: string; icon: React.ReactNode }[] = [
    { id: "dashboard", label: "Home", icon: <Home className="h-5 w-5" /> },
    { id: "booked-ops", label: "Booked", icon: <Bookmark className="h-5 w-5" /> },
    { id: "favorite-fields", label: "Favs", icon: <Heart className="h-5 w-5" /> },
    { id: "explore-games", label: "Browse", icon: <Compass className="h-5 w-5" /> },
    { id: "dashboard", label: "Profile", icon: <User className="h-5 w-5" /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-background border-t border-border px-4 py-2">
      <div className="flex items-center justify-around">
        {tabs.map((tab, idx) => (
          <Button
            key={`${tab.id}-${idx}`}
            onClick={() => setActiveTab(tab.id)}
            variant={activeTab === tab.id ? "default" : "ghost"}
            size="icon"
            className="rounded-lg"
          >
            {tab.icon}
          </Button>
        ))}
      </div>
    </div>
  );
}
