"use server";

import { createClient } from "@/lib/server";
import { Profile } from "@/lib/database.types";
import { redirect } from "next/navigation";

export async function registerAction(
  email: string,
  password: string,
  fullName: string,
  role: "owner" | "player"
) {
  const supabase = await createClient();

  // Register the user with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role,
      },
    },
  });

  if (authError) {
    return { error: authError.message, user: null };
  }

  if (!authData.user) {
    return { error: "User creation failed", user: null };
  }

  // Create profile in profiles table
  const { error: profileError } = await supabase.from("profiles").insert([
    {
      id: authData.user.id,
      email,
      full_name: fullName,
      role,
      username: email.split("@")[0], // Default username
    },
  ]);

  if (profileError) {
    return { error: `Profile creation failed: ${profileError.message}`, user: null };
  }

  return {
    error: null,
    user: authData.user,
    message: "Registration successful. Please check your email to confirm.",
  };
}

export async function loginAction(email: string, password: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message, user: null };
  }

  if (!data.user) {
    return { error: "Login failed", user: null };
  }

  // Fetch full profile
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single();

  if (profileError) {
    return { error: `Failed to fetch profile: ${profileError.message}`, user: null };
  }

  return {
    error: null,
    user: {
      ...data.user,
      profile: profileData as Profile,
    },
  };
}

export async function logoutAction() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: error.message };
  }

  redirect("/login");
}

export async function getCurrentUser() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  // Fetch profile
  const { data: profileData } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single();

  if (!profileData) {
    return null;
  }

  return {
    ...data.user,
    profile: profileData as Profile,
  };
}
