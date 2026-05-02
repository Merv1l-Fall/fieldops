import { createClient } from "@/lib/server";
import { Resend } from "resend";
import { EventReminderEmail } from "@/app/emails/EventReminder";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  // Verify this is from Vercel
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const supabase = await createClient();

    // Get reminders for 7 days from now
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    sevenDaysFromNow.setHours(0, 0, 0, 0);

    const sevenDaysFromNowEnd = new Date(sevenDaysFromNow);
    sevenDaysFromNowEnd.setHours(23, 59, 59, 999);

    const { data: bookings7d, error: error7d } = await supabase
      .from("bookings")
      .select(
        `
        id,
        player:profiles(*),
        event:events(*, field:fields(*))
      `
      )
      .eq("reminder_sent_7d", false)
      .gte("event.date", sevenDaysFromNow.toISOString())
      .lte("event.date", sevenDaysFromNowEnd.toISOString());

    if (error7d) {
      console.error("Error fetching 7-day reminders:", error7d);
      return new Response(JSON.stringify({ error: error7d.message }), {
        status: 500,
      });
    }

    // Send 7-day reminders
    for (const booking of bookings7d || []) {
      const player = booking.player;
      const event = booking.event;

      if (!player?.email) continue;

      const eventDate = new Date(event.date).toLocaleDateString("sv-SE", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      try {
        await resend.emails.send({
          from: "noreply@fieldops.app",
          to: player.email,
          subject: `Reminder: ${event.name} is in 7 days!`,
          react: EventReminderEmail({
            playerName: player.full_name || "Player",
            eventName: event.name,
            fieldName: event.field.name,
            eventDate,
            eventLocation: event.field.location,
            daysUntil: 7,
          }),
        });

        // Mark as sent
        await supabase
          .from("bookings")
          .update({ reminder_sent_7d: true })
          .eq("id", booking.id);
      } catch (err) {
        console.error(`Failed to send 7-day reminder for booking ${booking.id}:`, err);
      }
    }

    // Get reminders for 1 day from now
    const oneDayFromNow = new Date();
    oneDayFromNow.setDate(oneDayFromNow.getDate() + 1);
    oneDayFromNow.setHours(0, 0, 0, 0);

    const oneDayFromNowEnd = new Date(oneDayFromNow);
    oneDayFromNowEnd.setHours(23, 59, 59, 999);

    const { data: bookings1d, error: error1d } = await supabase
      .from("bookings")
      .select(
        `
        id,
        player:profiles(*),
        event:events(*, field:fields(*))
      `
      )
      .eq("reminder_sent_1d", false)
      .gte("event.date", oneDayFromNow.toISOString())
      .lte("event.date", oneDayFromNowEnd.toISOString());

    if (error1d) {
      console.error("Error fetching 1-day reminders:", error1d);
      return new Response(JSON.stringify({ error: error1d.message }), {
        status: 500,
      });
    }

    // Send 1-day reminders
    for (const booking of bookings1d || []) {
      const player = booking.player;
      const event = booking.event;

      if (!player?.email) continue;

      const eventDate = new Date(event.date).toLocaleDateString("sv-SE", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      try {
        await resend.emails.send({
          from: "noreply@fieldops.app",
          to: player.email,
          subject: `Reminder: ${event.name} is tomorrow!`,
          react: EventReminderEmail({
            playerName: player.full_name || "Player",
            eventName: event.name,
            fieldName: event.field.name,
            eventDate,
            eventLocation: event.field.location,
            daysUntil: 1,
          }),
        });

        // Mark as sent
        await supabase
          .from("bookings")
          .update({ reminder_sent_1d: true })
          .eq("id", booking.id);
      } catch (err) {
        console.error(`Failed to send 1-day reminder for booking ${booking.id}:`, err);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        sent7d: bookings7d?.length || 0,
        sent1d: bookings1d?.length || 0,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Cron job error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
