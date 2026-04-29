"use client";

import { LogOut, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SidebarActions() {
  return (
    <div className="mt-auto space-y-2 pt-4 border-t border-border">
      <Button
        variant="outline"
        size="sm"
        className="w-full justify-start text-xs font-semibold uppercase"
      >
        <HelpCircle className="h-4 w-4" />
        Support
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="w-full justify-start text-xs font-semibold uppercase"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </Button>
    </div>
  );
}
