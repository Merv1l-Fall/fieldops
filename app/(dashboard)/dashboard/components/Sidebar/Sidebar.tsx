"use client";

import { SidebarNav } from "./SidebarNav";
import { OperatorStatus } from "./OperatorStatus";''
import { BookedOpsSection } from "./BookedOpsSection";
import { FavoriteFieldsGrid } from "./FavoriteFieldsGrid";
// import { SidebarActions } from "./SidebarActions";

export function Sidebar() {
  return (
    <div className="hidden lg:flex flex-col gap-6 w-80 max-h-screen overflow-y-auto">
      {/* Navigation */}
      <SidebarNav />
    </div>
  );
}
