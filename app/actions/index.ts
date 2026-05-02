/**
 * Central exports for all server actions
 * Use: import { loginAction, getProfile } from "@/app/actions"
 */

// Auth
export { registerAction, loginAction, logoutAction, getCurrentUser } from "./auth";

// Profiles
export {
  getProfile,
  updateProfile,
  updateProfileAvatar,
  updateProfileUsername,
  updateProfileFullName,
} from "./profiles";

// Fields
export {
  getFieldsByOwner,
  getAllFields,
  getField,
  createField,
  updateField,
  deleteField,
} from "./fields";

// Events
export {
  getEventsByOwner,
  getOpenEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventBookingCount,
} from "./events";

// Bookings
export {
  getPlayerBookings,
  getEventBookings,
  getBooking,
  createBooking,
  cancelBooking,
  updateBookingReminderSent,
  getPlayerBookingsForEventReminders,
} from "./bookings";

// Waivers
export { getWaiver, signWaiver, hasSignedWaiver } from "./waivers";

// Notifications
export {
  getUserNotifications,
  getUnreadNotifications,
  markNotificationAsRead,
  createNotification,
  deleteNotification,
} from "./notifications";

// Favourites
export {
  getFavourites,
  isFavourite,
  addFavourite,
  removeFavourite,
  toggleFavourite,
} from "./favourites";

// Stripe
export { createStripeCheckoutAction } from "./stripe";
