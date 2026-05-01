"use server";

import { createClient } from "@/lib/server";
import { Waiver } from "@/lib/database.types";

export async function getWaiver(bookingId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("waivers")
    .select("*")
    .eq("booking_id", bookingId)
    .single();

  if (error) {
    // Waiver doesn't exist yet
    return null;
  }

  return data as Waiver;
}

export async function signWaiver(
  bookingId: string,
  playerId: string,
  ipAddress: string
) {
  const supabase = await createClient();

  // Verify booking belongs to player
  const { data: booking } = await supabase
    .from("bookings")
    .select("player_id")
    .eq("id", bookingId)
    .single();

  if (!booking || booking.player_id !== playerId) {
    return { error: "Unauthorized", data: null };
  }

  // Check if waiver already signed
  const existing = await getWaiver(bookingId);
  if (existing && existing.signed) {
    return { error: "Waiver already signed", data: null };
  }

  const { data, error } = await supabase
    .from("waivers")
    .upsert(
      {
        booking_id: bookingId,
        signed: true,
        signed_at: new Date().toISOString(),
        ip_address: ipAddress,
      },
      { onConflict: "booking_id" }
    )
    .select()
    .single();

  if (error) {
    return { error: error.message, data: null };
  }

  return { error: null, data: data as Waiver };
}

export async function hasSignedWaiver(bookingId: string): Promise<boolean> {
  const waiver = await getWaiver(bookingId);
  return waiver?.signed === true;
}
