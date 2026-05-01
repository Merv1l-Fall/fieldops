"use server";

import { createClient } from "@/lib/server";
import { Profile } from "@/lib/database.types";

export async function getProfile(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  return data as Profile;
}

export async function updateProfile(
  userId: string,
  updates: Partial<Omit<Profile, "id" | "created_at">>
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    return { error: error.message, data: null };
  }

  return { error: null, data: data as Profile };
}

export async function updateProfileAvatar(userId: string, avatarUrl: string) {
  return updateProfile(userId, { avatar_url: avatarUrl });
}

export async function updateProfileUsername(userId: string, username: string) {
  return updateProfile(userId, { username });
}

export async function updateProfileFullName(userId: string, fullName: string) {
  return updateProfile(userId, { full_name: fullName });
}
