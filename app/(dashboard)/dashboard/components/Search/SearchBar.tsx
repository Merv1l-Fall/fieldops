"use client";

import { Search } from "lucide-react";
import { useDashboardStore } from "@/lib/store/dashboardStore";
import { Input } from "@/components/ui/input";

export function SearchBar() {
  const { searchQuery, setSearchQuery } = useDashboardStore();

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="SEARCH MISSION PARAMETERS, FIELDS, OR OPERATIONS..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10 text-xs py-6"
      />
    </div>
  );
}
