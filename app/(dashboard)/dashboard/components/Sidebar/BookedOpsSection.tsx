"use client";

import { useDashboardStore } from "@/lib/store/dashboardStore";
import { Card } from "@/components/ui/card";
import { BookedOpsItem } from "./BookedOpsItem";
import { Button } from "@/components/ui/button";

// Mock data - replace with actual data from Supabase
const mockBookedOps = [
	{
		id: "1",
		name: "Nightfall Infiltration",
		field: "Urban Training",
		status: "completed" as const,
	},
	{
		id: "2",
		name: "Urban Defense V",
		field: "Downtown Combat",
		status: "pending" as const,
	},
];

export function BookedOpsSection() {
	const { selectedBookingId, setSelectedBookingId } = useDashboardStore();

	return (
		<Card className="p-4 space-y-3">
			<div>
				<h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Booked Ops</h3>
				<p className="text-xs text-primary mt-1">VIEW ALL</p>
			</div>

			<div className="space-y-2">
				{mockBookedOps.map((op) => (
					<BookedOpsItem
						key={op.id}
						{...op}
						isSelected={selectedBookingId === op.id}
						onClick={() => setSelectedBookingId(op.id)}
					/>
				))}
			</div>

			<Button variant="outline" size="sm" className="w-full text-xs">
				+ ADD NEW BOOKING
			</Button>
		</Card>
	);
}
