import { redirect } from "next/navigation";
import { getCurrentUser, getFieldsByOwner, getEventsByOwner } from "@/app/actions";
import { OwnerDashboard } from "./_components/OwnerDashboard";
import { AUTH_ROUTES, DASHBOARD_ROUTES } from "@/lib/constants/routes";

export default async function OwnerDashboardPage() {
  const result = await getCurrentUser();

  if (!result) {
    redirect(AUTH_ROUTES.LOGIN);
  }

  // If player, redirect to regular dashboard
  if (result.profile?.role !== "owner") {
    redirect(DASHBOARD_ROUTES.HOME);
  }

  const fields = await getFieldsByOwner(result.id);
  const events = await getEventsByOwner(result.id);

  return <OwnerDashboard userId={result.id} fields={fields} events={events} />;
}
