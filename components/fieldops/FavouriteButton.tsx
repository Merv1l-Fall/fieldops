"use client";

import { useState } from "react";
import { toggleFavourite } from "@/app/actions";
import { Field } from "@/lib/database.types";

interface FavouriteButtonProps {
  fieldId: string;
  playerId: string;
  isFavourited?: boolean;
  size?: "sm" | "md" | "lg";
}

export function FavouriteButton({
  fieldId,
  playerId,
  isFavourited = false,
  size = "md",
}: FavouriteButtonProps) {
  const [isFav, setIsFav] = useState(isFavourited);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      const result = await toggleFavourite(playerId, fieldId);

      if (!result.error) {
        setIsFav(!isFav);
      }
    } catch (error) {
      console.error("Failed to toggle favourite:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const sizeMap = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`transition-transform hover:scale-110 disabled:opacity-50 ${sizeMap[size]}`}
      title={isFav ? "Remove from favourites" : "Add to favourites"}
    >
      {isFav ? "❤️" : "🤍"}
    </button>
  );
}
