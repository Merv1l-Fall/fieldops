"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createEvent } from "@/app/actions";
import { Field, Event } from "@/lib/database.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface EventCreationFormProps {
  userId: string;
  fields: Field[];
  defaultFieldId?: string;
}

export function EventCreationForm({
  userId,
  fields,
  defaultFieldId,
}: EventCreationFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fieldId: defaultFieldId || fields[0]?.id || "",
    name: "",
    date: "",
    time: "12:00",
    maxPlayers: "20",
    priceCents: "0",
    paymentMode: "onsite" as const,
    waiverEnabled: false,
    reminderEnabled: true,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validate input
      if (!formData.fieldId) {
        setError("Please select a field");
        setIsLoading(false);
        return;
      }
      if (!formData.name.trim()) {
        setError("Event name is required");
        setIsLoading(false);
        return;
      }
      if (!formData.date) {
        setError("Event date is required");
        setIsLoading(false);
        return;
      }
      if (!formData.maxPlayers || parseInt(formData.maxPlayers) <= 0) {
        setError("Maximum players must be greater than 0");
        setIsLoading(false);
        return;
      }

      // Combine date and time
      const dateTime = new Date(`${formData.date}T${formData.time}`);

      // Validate future date
      if (dateTime < new Date()) {
        setError("Event date must be in the future");
        setIsLoading(false);
        return;
      }

      const eventData: Omit<Event, "id" | "created_at"> = {
        field_id: formData.fieldId,
        name: formData.name,
        date: dateTime.toISOString(),
        max_players: parseInt(formData.maxPlayers),
        price_cents: Math.round(parseFloat(formData.priceCents) * 100),
        status: "open",
        payment_mode: formData.paymentMode,
        waiver_enabled: formData.waiverEnabled,
        reminder_enabled: formData.reminderEnabled,
      };

      const result = await createEvent(formData.fieldId, userId, eventData);

      if (result.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      // Redirect to dashboard
      router.push(`/dashboard`);
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Field Selection */}
      <div>
        <Label htmlFor="fieldId" className="text-base font-semibold">
          Field
        </Label>
        <select
          id="fieldId"
          name="fieldId"
          value={formData.fieldId}
          onChange={handleChange}
          disabled={isLoading}
          className="mt-2 w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500 h-11"
        >
          <option value="">Select a field...</option>
          {fields.map((field) => (
            <option key={field.id} value={field.id}>
              {field.name} ({field.location})
            </option>
          ))}
        </select>
      </div>

      {/* Event Name */}
      <div>
        <Label htmlFor="name" className="text-base font-semibold">
          Event Name
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="e.g., Saturday Skirmish"
          value={formData.name}
          onChange={handleChange}
          disabled={isLoading}
          className="mt-2 h-11"
        />
      </div>

      {/* Date & Time */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date" className="text-base font-semibold">
            Date
          </Label>
          <Input
            id="date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            disabled={isLoading}
            className="mt-2 h-11"
          />
        </div>
        <div>
          <Label htmlFor="time" className="text-base font-semibold">
            Time
          </Label>
          <Input
            id="time"
            name="time"
            type="time"
            value={formData.time}
            onChange={handleChange}
            disabled={isLoading}
            className="mt-2 h-11"
          />
        </div>
      </div>

      {/* Max Players */}
      <div>
        <Label htmlFor="maxPlayers" className="text-base font-semibold">
          Maximum Players
        </Label>
        <Input
          id="maxPlayers"
          name="maxPlayers"
          type="number"
          min="1"
          placeholder="e.g., 20"
          value={formData.maxPlayers}
          onChange={handleChange}
          disabled={isLoading}
          className="mt-2 h-11"
        />
      </div>

      {/* Pricing */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="priceCents" className="text-base font-semibold">
            Price (SEK)
          </Label>
          <Input
            id="priceCents"
            name="priceCents"
            type="number"
            min="0"
            step="0.01"
            placeholder="0"
            value={formData.priceCents}
            onChange={handleChange}
            disabled={isLoading}
            className="mt-2 h-11"
          />
        </div>
        <div>
          <Label htmlFor="paymentMode" className="text-base font-semibold">
            Payment Mode
          </Label>
          <select
            id="paymentMode"
            name="paymentMode"
            value={formData.paymentMode}
            onChange={handleChange}
            disabled={isLoading}
            className="mt-2 w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500 h-11"
          >
            <option value="onsite">On-site Payment</option>
            <option value="online">Online Payment (Stripe)</option>
          </select>
        </div>
      </div>

      {/* Checkboxes */}
      <div className="space-y-3 pt-2">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="waiverEnabled"
            checked={formData.waiverEnabled}
            onChange={handleChange}
            disabled={isLoading}
            className="w-5 h-5 rounded border-zinc-300"
          />
          <span className="text-sm font-medium text-zinc-900">
            Require waiver signing (QR code on arrival)
          </span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="reminderEnabled"
            checked={formData.reminderEnabled}
            onChange={handleChange}
            disabled={isLoading}
            className="w-5 h-5 rounded border-zinc-300"
          />
          <span className="text-sm font-medium text-zinc-900">
            Send email reminders (7d and 1d before)
          </span>
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="p-4 border-red-200 bg-red-50">
          <p className="text-sm text-red-700">{error}</p>
        </Card>
      )}

      {/* Submit Button */}
      <div className="flex gap-4 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? "Creating..." : "Create Event"}
        </Button>
      </div>
    </form>
  );
}
