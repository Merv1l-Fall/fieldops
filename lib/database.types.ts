/**
 * Database type definitions for FieldOps
 * These match the Supabase schema exactly
 */

export interface Profile {
  id: string; // uuid (auth.users.id)
  full_name: string;
  email: string;
  role: "owner" | "player";
  created_at: string; // timestamp
  avatar_url?: string | null;
  username?: string | null;
}

export interface Field {
  id: string; // uuid
  owner_id: string; // uuid (references profiles.id)
  name: string;
  location: string;
  created_at: string; // timestamp
}

export interface Event {
  id: string; // uuid
  field_id: string; // uuid (references fields.id)
  name: string;
  date: string; // timestamp
  max_players: number; // int
  price_cents: number; // int (stored in cents, e.g., 1500 = 15.00 SEK)
  status: "open" | "full" | "cancelled";
  created_at: string; // timestamp
  payment_mode: "online" | "onsite";
  waiver_enabled: boolean;
  reminder_enabled: boolean;
}

export interface Booking {
  id: string; // uuid
  event_id: string; // uuid (references events.id)
  player_id: string; // uuid (references profiles.id)
  created_at: string; // timestamp
  stripe_session_id?: string | null;
  payment_status?: "pending" | "completed" | "failed" | null;
  reminder_sent_7d: boolean;
  reminder_sent_1d: boolean;
}

export interface Waiver {
  id: string; // uuid
  booking_id: string; // uuid (references bookings.id)
  signed: boolean;
  signed_at?: string | null; // timestamp
  ip_address?: string | null;
}

export interface Notification {
  user_id: string; // uuid (references profiles.id)
  type: string; // text
  message: string; // text
  read: boolean;
  created_at: string; // timestamp
}

export interface Favourite {
  id: string; // uuid
  player_id: string; // uuid (references profiles.id)
  field_id: string; // uuid (references fields.id)
  created_at: string; // timestamp
}

/**
 * Combined types for complex queries
 */

export interface EventWithField extends Event {
  field: Field;
}

export interface EventWithFieldAndBookingCount extends EventWithField {
  booking_count: number;
}

export interface BookingWithEvent extends Booking {
  event: EventWithField;
}

export interface BookingWithEventAndWaiver extends BookingWithEvent {
  waiver?: Waiver | null;
}
