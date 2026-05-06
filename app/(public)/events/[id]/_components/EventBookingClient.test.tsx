import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { EventBookingClient } from "./EventBookingClient";
import * as Actions from "@/app/actions";
import { useRouter } from "next/navigation";
import { EventWithField } from "@/lib/database.types";

// Mock all modules BEFORE imports
jest.mock("next/navigation");
jest.mock("@/app/actions");
jest.mock("@/lib/hooks/useToast");

// Setup mocks
const mockPush = jest.fn();
const mockToast = jest.fn();

jest.mocked(useRouter).mockReturnValue({
  push: mockPush,
} as any);

jest.mocked(require("@/lib/hooks/useToast").useToast).mockReturnValue({
  toast: mockToast,
});

describe("EventBookingClient - Booking Flow Integration Tests", () => {
  const mockEvent: EventWithField = {
    id: "event-1",
    field_id: "field-1",
    name: "Saturday Skirmish",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    max_players: 20,
    price_cents: 1500, // 15 SEK
    status: "published",
    payment_mode: "online",
    waiver_enabled: false,
    reminder_enabled: true,
    field: {
      id: "field-1",
      owner_id: "owner-1",
      name: "Downtown Arena",
      location: "Stockholm",
      created_at: new Date().toISOString(),
    },
    created_at: new Date().toISOString(),
  };

  const mockUser = {
    data: {
      id: "player-1",
      email: "player@example.com",
      profile: { role: "player" },
    },
    error: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockPush.mockClear();
    mockToast.mockClear();
  });

  describe("Test A: Online Payment Flow", () => {
    it("should skip Stripe and redirect to success page for onsite events", async () => {
      // Setup
      const onsiteEvent = { ...mockEvent, payment_mode: "onsite" };
      jest.mocked(Actions.getCurrentUser).mockResolvedValueOnce(mockUser);
      jest.mocked(Actions.createBooking).mockResolvedValueOnce({
        error: null,
        data: { id: "booking-1" } as any,
      });

      // Render and act
      const { getByRole } = render(
        <EventBookingClient
          eventId="event-1"
          event={onsiteEvent}
          spotsRemaining={5}
        />
      );

      fireEvent.click(getByRole("button", { name: /book now/i }));

      // Assert
      await waitFor(() => {
        // Should NOT call Stripe action for onsite
        expect(Actions.createStripeCheckoutAction).not.toHaveBeenCalled();

        // Should redirect to local success page
        expect(mockPush).toHaveBeenCalledWith("/booking/success/booking-1");
      });
    });
  });

  describe("Test B: Free Events", () => {
    it("should skip payment for free onsite events", async () => {
      // Setup
      const freeEvent = {
        ...mockEvent,
        payment_mode: "onsite",
        price_cents: 0,
      };
      jest.mocked(Actions.getCurrentUser).mockResolvedValueOnce(mockUser);
      jest.mocked(Actions.createBooking).mockResolvedValueOnce({
        error: null,
        data: { id: "booking-1" } as any,
      });

      // Render and act
      const { getByRole } = render(
        <EventBookingClient
          eventId="event-1"
          event={freeEvent}
          spotsRemaining={5}
        />
      );

      fireEvent.click(getByRole("button", { name: /book now/i }));

      // Assert
      await waitFor(() => {
        expect(Actions.createStripeCheckoutAction).not.toHaveBeenCalled();
        expect(mockPush).toHaveBeenCalledWith("/booking/success/booking-1");
      });
    });
  });

  describe("Test C: Button States", () => {
    it("should disable button when event is full", () => {
      // Setup
      render(
        <EventBookingClient
          eventId="event-1"
          event={mockEvent}
          spotsRemaining={0}
        />
      );

      // Assert
      const bookButton = screen.getByRole("button", { name: /event full/i });
      expect(bookButton).toBeDisabled();
    });

    it("should disable button when event is cancelled", () => {
      // Setup
      const cancelledEvent = { ...mockEvent, status: "cancelled" };
      render(
        <EventBookingClient
          eventId="event-1"
          event={cancelledEvent}
          spotsRemaining={5}
        />
      );

      // Assert
      const bookButton = screen.getByRole("button", {
        name: /event cancelled/i,
      });
      expect(bookButton).toBeDisabled();
    });
  });
});
