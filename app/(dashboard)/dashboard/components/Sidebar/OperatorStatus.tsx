"use client";

import { useUserStore } from "@/lib/store/userStore";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function OperatorStatus() {
	const { user } = useUserStore();

	return (
		<Card className="p-4 space-y-4">
			<div className="space-y-1">
				<h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
					Operator Status
				</h3>
			</div>

			<div className="space-y-3">
				<div>
					<p className="text-base font-bold text-foreground">{user?.full_name || "Operator"}</p>
					<div className="flex items-center gap-2 mt-1">
						<Badge variant="secondary" className="text-xs">
							LEVEL 45
						</Badge>
						<span className="text-xs text-muted-foreground">• LEAD SCORE</span>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-4 pt-2">
					<div>
						<p className="text-xs text-muted-foreground">ACCURACY</p>
						<div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
							<div className="h-full w-3/4 bg-primary"></div>
						</div>
						<p className="text-sm font-semibold text-primary mt-1">78%</p>
					</div>
					<div>
						<p className="text-xs text-muted-foreground">DEPLOYMENTS</p>
						<div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
							<div className="h-full w-2/3 bg-primary"></div>
						</div>
						<p className="text-sm font-semibold text-primary mt-1">156</p>
					</div>
				</div>
			</div>
		</Card>
	);
}
