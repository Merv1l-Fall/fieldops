"use client";

import { useDashboardStore } from "@/lib/store/dashboardStore";
import { BookedOpsMainSection } from "./BookedOpsMainSection";
import { FavoriteFieldsMainSection } from "./FavoriteFieldsMainSection";
import { ExploreGamesSection } from "./ExploreGamesSection";
import { SearchBar } from "../Search/SearchBar";

export function MainContent() {
  const { activeTab } = useDashboardStore();

  return (
    <div className="flex-1 min-w-0">
      <div className="space-y-6">
        <SearchBar />

        {(activeTab === "dashboard" || activeTab === "booked-ops") && (
          <BookedOpsMainSection />
        )}

        {(activeTab === "dashboard" || activeTab === "favorite-fields") && (
          <FavoriteFieldsMainSection />
        )}

        {(activeTab === "dashboard" || activeTab === "explore-games") && (
          <ExploreGamesSection />
        )}
      </div>
    </div>
  );
}
