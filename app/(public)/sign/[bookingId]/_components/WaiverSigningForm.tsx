"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signWaiver } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface WaiverSigningFormProps {
  bookingId: string;
  playerId: string;
}

export function WaiverSigningForm({ bookingId, playerId }: WaiverSigningFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);

  const handleSign = async () => {
    if (!agreed) {
      setError("You must agree to the waiver to continue");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get IP address
      const ipResponse = await fetch("https://api.ipify.org?format=json");
      const ipData = await ipResponse.json();
      const ipAddress = ipData.ip || "unknown";

      const result = await signWaiver(bookingId, playerId, ipAddress);

      if (result.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      router.push(`/booking/success/${bookingId}`);
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          disabled={isLoading}
          className="w-5 h-5 mt-1 rounded border-zinc-300"
        />
        <span className="text-sm font-medium text-zinc-900">
          I agree to the waiver and assume all risks associated with participating in
          this airsoft event.
        </span>
      </label>

      {error && (
        <Card className="p-4 border-red-200 bg-red-50">
          <p className="text-sm text-red-700">{error}</p>
        </Card>
      )}

      <Button
        onClick={handleSign}
        disabled={!agreed || isLoading}
        size="lg"
        className="w-full"
      >
        {isLoading ? "Signing..." : "Sign Waiver"}
      </Button>

      <p className="text-xs text-zinc-500 text-center">
        Your signature and IP address will be recorded as proof of signing.
      </p>
    </div>
  );
}
