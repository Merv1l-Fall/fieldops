import { notFound } from "next/navigation";
import { getEvent, getEventBookingCount } from "@/app/actions";
import { EventBookingClient } from "./_components/EventBookingClient";

interface EventPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) {
    notFound();
  }

  const bookingCount = await getEventBookingCount(id);
  const spotsRemaining = event.max_players - (bookingCount || 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-4xl font-bold text-zinc-900">{event.name}</h1>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    event.status === "open"
                      ? "bg-green-100 text-green-800"
                      : event.status === "full"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </span>
                </div>
                <p className="text-xl text-zinc-600 mb-4">{event.field.name}</p>
                <p className="text-lg text-zinc-600">{event.field.location}</p>
              </div>

              {/* Event Details */}
              <div className="grid grid-cols-2 gap-6 mb-8 py-8 border-y border-zinc-200">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide mb-2">
                    Date & Time
                  </h3>
                  <p className="text-lg text-zinc-900">
                    {new Date(event.date).toLocaleDateString("sv-SE", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-lg text-zinc-900">
                    {new Date(event.date).toLocaleTimeString("sv-SE", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide mb-2">
                    Spots Available
                  </h3>
                  <p className="text-lg text-zinc-900">
                    {spotsRemaining} / {event.max_players}
                  </p>
                  <div className="mt-2 bg-zinc-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{
                        width: `${((event.max_players - spotsRemaining) / event.max_players) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Pricing & Payment */}
              <div className="mb-8 p-6 bg-zinc-50 rounded-lg">
                <h3 className="text-lg font-semibold text-zinc-900 mb-4">Pricing & Payment</h3>
                <div className="flex items-baseline justify-between mb-4">
                  <span className="text-zinc-600">Price per player:</span>
                  <span className="text-3xl font-bold text-zinc-900">
                    {(event.price_cents / 100).toFixed(2)} SEK
                  </span>
                </div>
                <p className="text-sm text-zinc-600">
                  Payment mode:{" "}
                  <span className="font-semibold">
                    {event.payment_mode === "online" ? "Online (Stripe)" : "On-site"}
                  </span>
                </p>
              </div>

              {/* Additional Info */}
              <div className="space-y-4">
                {event.waiver_enabled && (
                  <div className="flex items-center text-zinc-700">
                    <span className="mr-3">✓</span>
                    <span>Waiver required (sign on arrival)</span>
                  </div>
                )}
                {event.reminder_enabled && (
                  <div className="flex items-center text-zinc-700">
                    <span className="mr-3">✓</span>
                    <span>Email reminders enabled</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Booking Card - Sidebar */}
          <div className="md:col-span-1">
            <EventBookingClient eventId={id} event={event} spotsRemaining={spotsRemaining} />
          </div>
        </div>
      </div>
    </div>
  );
}
