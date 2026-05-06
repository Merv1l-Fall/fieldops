import { redirect } from "next/navigation";
import { getCurrentUser, getFieldsByOwner, getEventsByOwner } from "@/app/actions";
import { OwnerDashboard } from "./_components/OwnerDashboard";

export default async function OwnerDashboardPage() {
  const result = await getCurrentUser();

  if (!result) {
    redirect("/login");
  }

  // If player, redirect to regular dashboard
  if (result.profile?.role !== "owner") {
    redirect("/dashboard");
  }

  const fields = await getFieldsByOwner(result.id);
  const events = await getEventsByOwner(result.id);

  return <OwnerDashboard userId={result.id} fields={fields} events={events} />;
}
