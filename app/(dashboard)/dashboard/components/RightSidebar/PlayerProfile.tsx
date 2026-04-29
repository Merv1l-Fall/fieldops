"use client";

import { useUserStore } from "@/lib/store/userStore";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export function PlayerProfile() {
  const { user } = useUserStore();

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative w-12 h-12">
          <Image
            src={user?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=default"}
            alt={user?.full_name || "Player"}
            fill
            className="rounded-full object-cover"
          />
        </div>
        <div>
          <p className="font-semibold text-foreground text-sm">{user?.full_name || "Operator"}</p>
          <Badge variant="secondary" className="text-xs mt-1">
            OPERATOR
          </Badge>
        </div>
      </div>

      <div className="pt-2 border-t border-border space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">LEVEL</span>
          <span className="text-sm font-semibold text-primary">42</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">LEAD</span>
          <span className="text-sm font-semibold text-primary">OPERATOR</span>
        </div>
      </div>
    </Card>
  );
}
