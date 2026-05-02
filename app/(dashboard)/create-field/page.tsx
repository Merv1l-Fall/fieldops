import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/actions";
import { FieldCreationForm } from "./_components/FieldCreationForm";

export default async function CreateFieldPage() {
  const result = await getCurrentUser();

  if (!result.data) {
    redirect("/login");
  }

  if (result.data.profile?.role !== "owner") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-zinc-900">Create Field</h1>
            <p className="text-lg text-zinc-600 mt-2">
              Set up your first airsoft field to start hosting events
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <FieldCreationForm userId={result.data.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
