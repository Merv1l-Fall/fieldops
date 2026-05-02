"use server";

import { createCheckoutSession } from "@/lib/stripe";

export async function createStripeCheckoutAction(
  eventId: string,
  bookingId: string,
  playerId: string,
  priceInCents: number,
  eventName: string
) {
  const checkoutUrl = await createCheckoutSession(
    eventId,
    bookingId,
    playerId,
    priceInCents,
    eventName
  );

  if (!checkoutUrl) {
    return { error: "Failed to create checkout session", data: null };
  }

  return { error: null, data: { checkoutUrl } };
}
