import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

export async function createCheckoutSession(
  eventId: string,
  bookingId: string,
  playerId: string,
  priceInCents: number,
  eventName: string
): Promise<string | null> {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "sek",
            product_data: {
              name: eventName,
              description: `Booking for airsoft event: ${eventName}`,
            },
            unit_amount: priceInCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/success/${bookingId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/events/${eventId}`,
      client_reference_id: bookingId,
      metadata: {
        booking_id: bookingId,
        player_id: playerId,
        event_id: eventId,
      },
    });

    return session.url || null;
  } catch (error) {
    console.error("Error creating Stripe checkout session:", error);
    return null;
  }
}

export async function getCheckoutSession(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session;
  } catch (error) {
    console.error("Error retrieving Stripe session:", error);
    return null;
  }
}
