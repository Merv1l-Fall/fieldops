import { createClient } from "@/lib/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-04.acacia",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature") || "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new Response("Webhook signature verification failed", { status: 400 });
  }

  try {
    const supabase = await createClient();

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // Update booking payment status
        const { error } = await supabase
          .from("bookings")
          .update({
            payment_status: "paid",
            stripe_session_id: session.id,
          })
          .eq("stripe_session_id", session.id);

        if (error) {
          console.error("Error updating booking:", error);
        }
        break;
      }

      case "charge.failed": {
        const charge = event.data.object as Stripe.Charge;

        // Update booking payment status
        if (charge.metadata.stripe_session_id) {
          const { error } = await supabase
            .from("bookings")
            .update({ payment_status: "failed" })
            .eq("stripe_session_id", charge.metadata.stripe_session_id);

          if (error) {
            console.error("Error updating booking:", error);
          }
        }
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;

        // Handle refund - delete booking or mark as cancelled
        if (charge.metadata.stripe_session_id) {
          const { error } = await supabase
            .from("bookings")
            .delete()
            .eq("stripe_session_id", charge.metadata.stripe_session_id);

          if (error) {
            console.error("Error deleting refunded booking:", error);
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return new Response("Webhook processing error", { status: 500 });
  }
}
