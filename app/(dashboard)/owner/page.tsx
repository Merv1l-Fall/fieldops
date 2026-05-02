import { redirect } from "next/navigation";
import { getCurrentUser, getFieldsByOwner, getEventsByOwner } from "@/app/actions";
import { OwnerDashboard } from "./_components/OwnerDashboard";

export default async function OwnerDashboardPage() {
  const result = await getCurrentUser();

  if (!result.data) {
    redirect("/login");
  }

  // If player, redirect to regular dashboard
  if (result.data.profile?.role !== "owner") {
    redirect("/dashboard");
  }

  const fields = await getFieldsByOwner(result.data.id);
  const events = await getEventsByOwner(result.data.id);

  return <OwnerDashboard userId={result.data.id} fields={fields} events={events} />;
}
