"use server";

import { createClient } from "@/lib/server";
import { Booking, BookingWithEventAndWaiver } from "@/lib/database.types";

export async function getPlayerBookings(playerId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("bookings")
    .select(
      `
      *,
      event:events(*),
      waiver:waivers(*)
    `
    )
    .eq("player_id", playerId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching player bookings:", error);
    return [];
  }

  return data as BookingWithEventAndWaiver[];
}

export async function getEventBookings(eventId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("bookings")
    .select(
      `
      *,
      event:events(*)
    `
    )
    .eq("event_id", eventId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching event bookings:", error);
    return [];
  }

  return data as Booking[];
}

export async function getBooking(bookingId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("bookings")
    .select(
      `
      *,
      event:events(*),
      waiver:waivers(*)
    `
    )
    .eq("id", bookingId)
    .single();

  if (error) {
    console.error("Error fetching booking:", error);
    return null;
  }

  return data as BookingWithEventAndWaiver;
}

export async function createBooking(eventId: string, playerId: string) {
  const supabase = await createClient();

  // Check if already booked
  const { data: existing } = await supabase
    .from("bookings")
    .select("id")
    .eq("event_id", eventId)
    .eq("player_id", playerId)
    .single();

  if (existing) {
    return { error: "Already booked for this event", data: null };
  }

  // Check event capacity
  const { data: event } = await supabase
    .from("events")
    .select("max_players")
    .eq("id", eventId)
    .single();

  const { count: bookingCount } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("event_id", eventId);

  if (event && bookingCount && bookingCount >= event.max_players) {
    return { error: "Event is full", data: null };
  }

  const { data, error } = await supabase
    .from("bookings")
    .insert([{ event_id: eventId, player_id: playerId }])
    .select(
      `
      *,
      event:events(*),
      waiver:waivers(*)
    `
    )
    .single();

  if (error) {
    return { error: error.message, data: null };
  }

  return { error: null, data: data as BookingWithEventAndWaiver };
}

export async function cancelBooking(bookingId: string, playerId: string) {
  const supabase = await createClient();

  // Verify ownership
  const booking = await getBooking(bookingId);
  if (!booking || booking.player_id !== playerId) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase.from("bookings").delete().eq("id", bookingId);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

export async function updateBookingReminderSent(
  bookingId: string,
  reminderType: "7d" | "1d"
) {
  const supabase = await createClient();

  const updateData =
    reminderType === "7d"
      ? { reminder_sent_7d: true }
      : { reminder_sent_1d: true };

  const { error } = await supabase.from("bookings").update(updateData).eq("id", bookingId);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

export async function getPlayerBookingsForEventReminders() {
  const supabase = await createClient();

  // Get bookings that need 7-day reminder (not sent yet)
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

  const { data, error } = await supabase
    .from("bookings")
    .select(
      `
      *,
      event:events(*, field:fields(*)),
      player:profiles(*)
    `
    )
    .eq("reminder_sent_7d", false)
    .gte("event.date", new Date().toISOString())
    .lte("event.date", sevenDaysFromNow.toISOString());

  if (error) {
    console.error("Error fetching reminders:", error);
    return [];
  }

  return data;
}
