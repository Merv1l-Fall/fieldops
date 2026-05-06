import { notFound } from "next/navigation";
import { getBooking } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

interface BookingSuccessPageProps {
  params: Promise<{ bookingId: string }>;
}

export default async function BookingSuccessPage({ params }: BookingSuccessPageProps) {
  const { bookingId } = await params;
  const booking = await getBooking(bookingId);

  if (!booking) {
    notFound();
  }

  const eventDate = new Date(booking.event.date);
  const isPaid = booking.payment_status === "completed";

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="mb-6 inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
            <span className="text-3xl">✓</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">Booking Confirmed!</h1>
          <p className="text-lg text-zinc-600 mb-8">Your spot has been reserved</p>

          {/* Booking Details */}
          <Card className="bg-zinc-50 p-6 mb-8 text-left">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-zinc-600">Event</p>
                <p className="font-semibold text-zinc-900">{booking.event.name}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-600">Location</p>
                <p className="font-semibold text-zinc-900">{booking.event.field.location}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-600">Date & Time</p>
                <p className="font-semibold text-zinc-900">
                  {eventDate.toLocaleDateString("sv-SE", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              {booking.event.payment_mode === "online" && (
                <div>
                  <p className="text-sm text-zinc-600">Payment Status</p>
                  <p className="font-semibold text-green-600">
                    {isPaid ? "✓ Paid" : "Pending Payment"}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm text-zinc-600">Booking ID</p>
                <p className="font-mono text-sm text-zinc-900">{bookingId}</p>
              </div>
            </div>
          </Card>

          {/* Important Notes */}
          <div className="mb-8 text-left bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Important Reminders</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Check your email for confirmation and event details</li>
              {booking.event.waiver_enabled && (
                <li>• You'll need to sign a waiver upon arrival</li>
              )}
              {booking.event.reminder_enabled && (
                <li>• Reminder emails will be sent 7 days and 1 day before the event</li>
              )}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Link href="/dashboard" className="w-full">
              <Button variant="outline" className="w-full">
                Back to Dashboard
              </Button>
            </Link>
            <Link href="/" className="w-full">
              <Button className="w-full">Browse More Events</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
