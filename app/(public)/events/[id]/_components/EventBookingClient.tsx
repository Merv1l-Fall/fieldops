"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBooking, getCurrentUser, createStripeCheckoutAction } from "@/app/actions";
import { AUTH_ROUTES, PUBLIC_ROUTES } from "@/lib/constants/routes";
import { EventWithField } from "@/lib/database.types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/lib/hooks/useToast";

interface EventBookingClientProps {
  eventId: string;
  event: EventWithField;
  spotsRemaining: number;
}

export function EventBookingClient({
  eventId,
  event,
  spotsRemaining,
}: EventBookingClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleBooking = async () => {
    setIsLoading(true);

    try {
      // Get current user
      const userResult = await getCurrentUser();

      if (!userResult) {
        toast({
          title: "Login Required",
          description: "Please log in to book an event",
          variant: "default",
        });
        router.push(`${AUTH_ROUTES.LOGIN}?redirect=${PUBLIC_ROUTES.EVENT_DETAIL(eventId)}`);
        return;
      }

      // Create booking
      const bookingResult = await createBooking(eventId, userResult.id);

      if (bookingResult.error) {
        toast({
          title: "Booking Failed",
          description: bookingResult.error,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Handle payment if online
      if (event.payment_mode === "online" && event.price_cents > 0) {
        // Create Stripe checkout session
        const checkoutResult = await createStripeCheckoutAction(
          eventId,
          bookingResult.data?.id || "",
          userResult.id,
          event.price_cents,
          event.name
        );

        if (checkoutResult.error || !checkoutResult.data?.checkoutUrl) {
          toast({
            title: "Payment Setup Failed",
            description: "Could not create checkout session. Please try again.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        // Redirect to Stripe Checkout
        window.location.href = checkoutResult.data.checkoutUrl;
      } else {
        // Onsite payment - go directly to success
        toast({
          title: "Booking Confirmed!",
          description: `Your spot has been reserved. See you on ${new Date(event.date).toLocaleDateString("sv-SE")}!`,
          variant: "default",
        });
        router.push(PUBLIC_ROUTES.BOOKING_SUCCESS(bookingResult.data?.id || ""));
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      console.error(error);
      setIsLoading(false);
    }
  };

  const isEventFull = spotsRemaining <= 0;
  const isEventCancelled = event.status === "cancelled";

  return (
    <Card className="sticky top-4 p-6">
      <div className="space-y-6">
        {/* Status */}
        <div>
          <div className="text-sm text-zinc-600 mb-1">Availability</div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-zinc-900">{spotsRemaining}</span>
            <span className="text-zinc-600">spots left</span>
          </div>
        </div>

        {/* CTA Button */}
        <Button
          onClick={handleBooking}
          disabled={isEventFull || isEventCancelled || isLoading}
          size="lg"
          className="w-full h-12 text-lg font-semibold"
        >
          {isLoading ? "Booking..." : isEventFull ? "Event Full" : isEventCancelled ? "Event Cancelled" : "Book Now"}
        </Button>

        {/* Additional Info */}
        <div className="space-y-2 text-sm text-zinc-600">
          {event.payment_mode === "online" && event.price_cents > 0 && (
            <p>
              💳 Payment: {(event.price_cents / 100).toFixed(2)} SEK (Stripe)
            </p>
          )}
          {event.payment_mode === "onsite" && event.price_cents > 0 && (
            <p>
              💰 Payment: {(event.price_cents / 100).toFixed(2)} SEK (On-site)
            </p>
          )}
          {event.price_cents === 0 && (
            <p>✓ Free event</p>
          )}
          {event.waiver_enabled && (
            <p>📋 Waiver required</p>
          )}
        </div>
      </div>
    </Card>
  );
}
