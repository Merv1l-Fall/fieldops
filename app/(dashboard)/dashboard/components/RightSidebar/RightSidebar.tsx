"use client";

import { PlayerProfile } from "./PlayerProfile";
import { PlayerStats } from "./PlayerStats";
import { LocalAlert } from "./LocalAlert";

export function RightSidebar() {
  return (
    <div className="hidden lg:flex flex-col gap-6 w-72">
      <PlayerProfile />
      <PlayerStats />
      <LocalAlert />
    </div>
  );
}
