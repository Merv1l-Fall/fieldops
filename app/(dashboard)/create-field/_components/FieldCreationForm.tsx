"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createField } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface FieldCreationFormProps {
  userId: string;
}

export function FieldCreationForm({ userId }: FieldCreationFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validate input
      if (!formData.name.trim()) {
        setError("Field name is required");
        setIsLoading(false);
        return;
      }
      if (!formData.location.trim()) {
        setError("Location is required");
        setIsLoading(false);
        return;
      }

      const result = await createField(userId, formData.name, formData.location);

      if (result.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      // Redirect to field detail or dashboard
      router.push(`/dashboard`);
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Field Name */}
      <div>
        <Label htmlFor="name" className="text-base font-semibold">
          Field Name
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="e.g., Downtown Airsoft Arena"
          value={formData.name}
          onChange={handleChange}
          disabled={isLoading}
          className="mt-2 h-11"
        />
        <p className="text-sm text-zinc-600 mt-1">
          This is the public name players will see when booking
        </p>
      </div>

      {/* Location */}
      <div>
        <Label htmlFor="location" className="text-base font-semibold">
          Location
        </Label>
        <Input
          id="location"
          name="location"
          type="text"
          placeholder="e.g., 123 Main Street, Stockholm"
          value={formData.location}
          onChange={handleChange}
          disabled={isLoading}
          className="mt-2 h-11"
        />
        <p className="text-sm text-zinc-600 mt-1">
          The address where players will find your field
        </p>
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
          {isLoading ? "Creating..." : "Create Field"}
        </Button>
      </div>
    </form>
  );
}
