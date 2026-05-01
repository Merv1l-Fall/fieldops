"use server";

import { createClient } from "@/lib/server";
import { Favourite } from "@/lib/database.types";

export async function getFavourites(playerId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("favourites")
    .select(
      `
      *,
      field:fields(*)
    `
    )
    .eq("player_id", playerId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching favourites:", error);
    return [];
  }

  return data;
}

export async function isFavourite(playerId: string, fieldId: string): Promise<boolean> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("favourites")
    .select("id")
    .eq("player_id", playerId)
    .eq("field_id", fieldId)
    .single();

  if (error) {
    return false;
  }

  return !!data;
}

export async function addFavourite(playerId: string, fieldId: string) {
  const supabase = await createClient();

  // Check if already favourited
  const alreadyFavourited = await isFavourite(playerId, fieldId);
  if (alreadyFavourited) {
    return { error: "Already in favourites", data: null };
  }

  const { data, error } = await supabase
    .from("favourites")
    .insert([{ player_id: playerId, field_id: fieldId }])
    .select(
      `
      *,
      field:fields(*)
    `
    )
    .single();

  if (error) {
    return { error: error.message, data: null };
  }

  return { error: null, data: data as Favourite };
}

export async function removeFavourite(playerId: string, fieldId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("favourites")
    .delete()
    .eq("player_id", playerId)
    .eq("field_id", fieldId);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

export async function toggleFavourite(playerId: string, fieldId: string) {
  const isFav = await isFavourite(playerId, fieldId);

  if (isFav) {
    return removeFavourite(playerId, fieldId);
  } else {
    return addFavourite(playerId, fieldId);
  }
}
