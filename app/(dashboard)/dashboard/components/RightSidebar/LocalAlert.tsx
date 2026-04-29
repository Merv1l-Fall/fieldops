"use client";

import { Cloud, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";

export function LocalAlert() {
  return (
    <Card className="p-4 space-y-3">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Cloud className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground uppercase">Weather</span>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Roadiness</p>
          <p className="text-sm font-semibold text-foreground mt-1">Field Congestion</p>
        </div>
        <div className="flex gap-2 text-xs">
          <span className="text-muted-foreground">00 / 727</span>
          <span className="text-amber-500">MODERATE</span>
        </div>
      </div>

      <div className="pt-3 border-t border-border flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-amber-500" />
        <span className="text-xs text-amber-500">3 OPS NEARBY</span>
      </div>
    </Card>
  );
}
