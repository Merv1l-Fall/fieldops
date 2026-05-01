"use server";

import { createClient } from "@/lib/server";
import { Field } from "@/lib/database.types";

export async function getFieldsByOwner(ownerId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("fields")
    .select("*")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching fields:", error);
    return [];
  }

  return data as Field[];
}

export async function getAllFields() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("fields")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching all fields:", error);
    return [];
  }

  return data as Field[];
}

export async function getField(fieldId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("fields")
    .select("*")
    .eq("id", fieldId)
    .single();

  if (error) {
    console.error("Error fetching field:", error);
    return null;
  }

  return data as Field;
}

export async function createField(ownerId: string, name: string, location: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("fields")
    .insert([{ owner_id: ownerId, name, location }])
    .select()
    .single();

  if (error) {
    return { error: error.message, data: null };
  }

  return { error: null, data: data as Field };
}

export async function updateField(
  fieldId: string,
  ownerId: string,
  updates: Partial<Omit<Field, "id" | "owner_id" | "created_at">>
) {
  const supabase = await createClient();

  // Verify ownership
  const field = await getField(fieldId);
  if (!field || field.owner_id !== ownerId) {
    return { error: "Unauthorized", data: null };
  }

  const { data, error } = await supabase
    .from("fields")
    .update(updates)
    .eq("id", fieldId)
    .select()
    .single();

  if (error) {
    return { error: error.message, data: null };
  }

  return { error: null, data: data as Field };
}

export async function deleteField(fieldId: string, ownerId: string) {
  const supabase = await createClient();

  // Verify ownership
  const field = await getField(fieldId);
  if (!field || field.owner_id !== ownerId) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase.from("fields").delete().eq("id", fieldId);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
