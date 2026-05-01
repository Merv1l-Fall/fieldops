"use server";

import { createClient } from "@/lib/server";
import { Notification } from "@/lib/database.types";

export async function getUserNotifications(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }

  return data as Notification[];
}

export async function getUnreadNotifications(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .eq("read", false)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching unread notifications:", error);
    return [];
  }

  return data as Notification[];
}

export async function markNotificationAsRead(
  userId: string,
  notificationId: number
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", userId);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

export async function createNotification(
  userId: string,
  type: string,
  message: string
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("notifications")
    .insert([{ user_id: userId, type, message, read: false }]);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

export async function deleteNotification(userId: string, createdAt: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("notifications")
    .delete()
    .eq("user_id", userId)
    .eq("created_at", createdAt);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
