import { notFound } from "next/navigation";
import { getBooking } from "@/app/actions";
import { WaiverSigningForm } from "./_components/WaiverSigningForm";

interface SignWaiverPageProps {
  params: Promise<{ bookingId: string }>;
}

export default async function SignWaiverPage({ params }: SignWaiverPageProps) {
  const { bookingId } = await params;
  const booking = await getBooking(bookingId);

  if (!booking) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-zinc-900 mb-2">Event Waiver</h1>
            <p className="text-lg text-zinc-600">{booking.event.name}</p>
          </div>

          <div className="mb-8">
            <div className="bg-zinc-50 rounded-lg p-6 mb-6">
              <h2 className="font-semibold text-zinc-900 mb-4">Waiver Agreement</h2>
              <p className="text-sm text-zinc-700 leading-relaxed mb-4">
                I acknowledge that I am participating in an airsoft event at my own risk.
                I understand that airsoft involves the use of replica firearms and impact
                from projectiles. I agree to follow all safety rules and regulations as
                outlined by the event organizers.
              </p>
              <p className="text-sm text-zinc-700 leading-relaxed">
                I assume full responsibility for any injuries, damages, or losses that may
                occur during this event. The event organizers, field owners, and other
                participants are not liable for any injuries or damages.
              </p>
            </div>

            <WaiverSigningForm bookingId={bookingId} playerId={booking.player_id} />
          </div>
        </div>
      </div>
    </div>
  );
}
