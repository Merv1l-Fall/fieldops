"use client";

import { ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface BookingItemProps {
  id: string;
  name: string;
  field: string;
  date: string;
  status: "deployed" | "standby";
}

function BookingCard({ id, name, field, date, status }: BookingItemProps) {
  const Icon = status === "deployed" ? CheckCircle2 : AlertCircle;

  return (
    <div className="p-4 border-b last:border-b-0">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
            status === "deployed" ? "text-primary" : "text-amber-500"
          }`} />
          <div>
            <p className="font-semibold text-foreground">{name}</p>
            <p className="text-sm text-muted-foreground">{field}</p>
            <p className="text-xs text-muted-foreground mt-2">{date}</p>
          </div>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      </div>
      <div className="mt-3">
        <Badge variant={status === "deployed" ? "default" : "secondary"}>
          {status === "deployed" ? "DEPLOYED" : "STANDBY"}
        </Badge>
      </div>
    </div>
  );
}

// Mock data
const mockBookings = [
  {
    id: "1",
    name: "Nightfall Infiltration",
    field: "Sector 7 • Oct 28, 20:00",
    date: "Upcoming",
    status: "deployed" as const,
  },
  {
    id: "2",
    name: "Urban Defense V",
    field: "The Factory • Oct 25, 09:00",
    date: "This Week",
    status: "standby" as const,
  },
];

export function BookedOpsMainSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Booked Ops</h2>
          <p className="text-sm text-primary">4 ACTIVE</p>
        </div>
        <Button variant="ghost" className="text-primary hover:text-primary/80">
          VIEW ALL DEPLOYMENTS →
        </Button>
      </div>

      <Card className="flex flex-col">
        {mockBookings.map((booking) => (
          <BookingCard key={booking.id} {...booking} />
        ))}
      </Card>
    </div>
  );
}
