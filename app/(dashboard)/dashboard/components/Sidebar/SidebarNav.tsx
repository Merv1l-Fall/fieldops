"use client";

import { Zap, BarChart3, Star, Compass } from "lucide-react";
import { useDashboardStore, type DashboardTab } from "@/lib/store/dashboardStore";
import { Button } from "@/components/ui/button";

const navItems: { id: DashboardTab; label: string; icon: React.ReactNode }[] = [
  { id: "dashboard", label: "DASHBOARD", icon: <Zap className="h-4 w-4" /> },
  { id: "booked-ops", label: "BOOKED OPS", icon: <BarChart3 className="h-4 w-4" /> },
  {
    id: "favorite-fields",
    label: "FAVORITE FIELDS",
    icon: <Star className="h-4 w-4" />,
  },
  { id: "explore-games", label: "EXPLORE GAMES", icon: <Compass className="h-4 w-4" /> },
];

export function SidebarNav() {
  const { activeTab, setActiveTab } = useDashboardStore();

  return (
    <div className="space-y-2">
      <div className="px-3 py-2">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
          Operations Center
        </h2>
      </div>
      <nav className="space-y-1">
        {navItems.map((item) => (
          <Button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            variant={activeTab === item.id ? "default" : "ghost"}
            size="sm"
            className="w-full justify-start text-xs font-semibold uppercase"
          >
            {item.icon}
            {item.label}
          </Button>
        ))}
      </nav>
    </div>
  );
}
