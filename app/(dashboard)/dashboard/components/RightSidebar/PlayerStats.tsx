"use client";

import { Card } from "@/components/ui/card";

export function PlayerStats() {
  return (
    <Card className="p-4 space-y-4">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
        Mission Stats
      </h3>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-muted-foreground">MISSIONS</span>
            <span className="text-sm font-semibold text-primary">12</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full w-3/4 bg-primary"></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-muted-foreground">WIN RATE</span>
            <span className="text-sm font-semibold text-primary">68%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full w-2/3 bg-primary"></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-muted-foreground">PERFORMANCE</span>
            <span className="text-sm font-semibold text-primary">A-</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full w-5/6 bg-primary"></div>
          </div>
        </div>
      </div>
    </Card>
  );
}
