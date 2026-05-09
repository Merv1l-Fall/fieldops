import { redirect } from "next/navigation";
import { getCurrentUser, getFieldsByOwner } from "@/app/actions";
import { EventCreationForm } from "./_components/EventCreationForm";
import { AUTH_ROUTES, DASHBOARD_ROUTES } from "@/lib/constants/routes";

interface CreateEventPageProps {
  searchParams: Promise<{ fieldId?: string }>;
}

export default async function CreateEventPage({ searchParams }: CreateEventPageProps) {
  const result = await getCurrentUser();

  if (!result) {
    redirect(AUTH_ROUTES.LOGIN);
  }

  if (result.profile?.role !== "owner") {
    redirect(DASHBOARD_ROUTES.HOME);
  }

  const fields = await getFieldsByOwner(result.id);

  if (fields.length === 0) {
    redirect(DASHBOARD_ROUTES.CREATE_FIELD);
  }

  const { fieldId } = await searchParams;

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-zinc-900">Create Event</h1>
            <p className="text-lg text-zinc-600 mt-2">
              Set up a new airsoft game day at one of your fields
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <EventCreationForm
              userId={result.id}
              fields={fields}
              defaultFieldId={fieldId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
