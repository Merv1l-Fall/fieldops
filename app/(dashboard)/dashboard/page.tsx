"use client";

import { Sidebar } from "./components/Sidebar/Sidebar";
import { MainContent } from "./components/MainContent/MainContent";
import { RightSidebar } from "./components/RightSidebar/RightSidebar";
import { MobileBottomNav } from "./components/MobileBottomNav";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <div className="mx-auto max-w-full px-4 py-6 lg:max-w-7xl lg:px-8">
        <div className="flex gap-6">
          {/* Left Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <MainContent />

          {/* Right Sidebar */}
          <RightSidebar />
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}
