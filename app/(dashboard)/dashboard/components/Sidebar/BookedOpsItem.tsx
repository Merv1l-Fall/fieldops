"use client";

import { CheckCircle2, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BookedOpsItemProps {
	id: string;
	name: string;
	field: string;
	status: "completed" | "pending";
	isSelected?: boolean;
	onClick?: () => void;
}

export function BookedOpsItem({ id, name, field, status, isSelected = false, onClick }: BookedOpsItemProps) {
	const Icon = status === "completed" ? CheckCircle2 : AlertCircle;

	return (
		<Card
			onClick={onClick}
			className={`p-3 cursor-pointer transition-all hover:bg-muted ${
				isSelected ? "border-primary/50 bg-muted" : ""
			}`}
		>
			<div className="flex items-start gap-3">
				<Icon
					className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
						status === "completed" ? "text-primary" : "text-amber-500"
					}`}
				/>
				<div className="min-w-0 flex-1">
					<p className="text-sm font-semibold text-foreground truncate">{name}</p>
					<p className="text-xs text-muted-foreground truncate">{field}</p>
					<div className="mt-2">
						<Badge variant={status === "completed" ? "default" : "secondary"} className="text-xs">
							{status === "completed" ? "DEPLOYED" : "STANDBY"}
						</Badge>
					</div>
				</div>
			</div>
		</Card>
	);
}
