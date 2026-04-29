"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ExploreGamesSection() {
  return (
    <Card className="bg-primary/10 border border-primary/20 p-6">
      <div className="space-y-4">
        <div>
          <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-3">
            <span className="text-primary text-lg">🎮</span>
          </div>
          <h3 className="text-lg font-semibold text-foreground">Explore Games</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Discovery tactical operations in your sector.
          </p>
        </div>

        <Button className="w-full bg-primary hover:bg-primary/80 text-primary-foreground font-semibold">
          OPEN MISSION MAP →
        </Button>
      </div>
    </Card>
  );
}
