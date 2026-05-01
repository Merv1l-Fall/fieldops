"use server";

import { createClient } from "@/lib/server";
import { Event, EventWithField } from "@/lib/database.types";

export async function getEventsByOwner(ownerId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events")
    .select(
      `
      *,
      field:fields(*)
    `
    )
    .eq("fields.owner_id", ownerId)
    .order("date", { ascending: true });

  if (error) {
    console.error("Error fetching owner events:", error);
    return [];
  }

  return data as EventWithField[];
}

export async function getOpenEvents() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events")
    .select(
      `
      *,
      field:fields(*)
    `
    )
    .eq("status", "open")
    .gte("date", new Date().toISOString())
    .order("date", { ascending: true });

  if (error) {
    console.error("Error fetching open events:", error);
    return [];
  }

  return data as EventWithField[];
}

export async function getEvent(eventId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events")
    .select(
      `
      *,
      field:fields(*)
    `
    )
    .eq("id", eventId)
    .single();

  if (error) {
    console.error("Error fetching event:", error);
    return null;
  }

  return data as EventWithField;
}

export async function createEvent(
  fieldId: string,
  ownerId: string,
  eventData: Omit<Event, "id" | "created_at">
) {
  const supabase = await createClient();

  // Verify field ownership
  const { data: field } = await supabase
    .from("fields")
    .select("owner_id")
    .eq("id", fieldId)
    .single();

  if (!field || field.owner_id !== ownerId) {
    return { error: "Unauthorized", data: null };
  }

  const { data, error } = await supabase
    .from("events")
    .insert([{ field_id: fieldId, ...eventData }])
    .select(`*, field:fields(*)`)
    .single();

  if (error) {
    return { error: error.message, data: null };
  }

  return { error: null, data: data as EventWithField };
}

export async function updateEvent(
  eventId: string,
  ownerId: string,
  updates: Partial<Omit<Event, "id" | "field_id" | "created_at">>
) {
  const supabase = await createClient();

  // Verify ownership
  const event = await getEvent(eventId);
  if (!event || event.field.owner_id !== ownerId) {
    return { error: "Unauthorized", data: null };
  }

  const { data, error } = await supabase
    .from("events")
    .update(updates)
    .eq("id", eventId)
    .select(`*, field:fields(*)`)
    .single();

  if (error) {
    return { error: error.message, data: null };
  }

  return { error: null, data: data as EventWithField };
}

export async function deleteEvent(eventId: string, ownerId: string) {
  const supabase = await createClient();

  // Verify ownership
  const event = await getEvent(eventId);
  if (!event || event.field.owner_id !== ownerId) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase.from("events").delete().eq("id", eventId);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

export async function getEventBookingCount(eventId: string) {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("event_id", eventId);

  if (error) {
    console.error("Error fetching booking count:", error);
    return 0;
  }

  return count || 0;
}
