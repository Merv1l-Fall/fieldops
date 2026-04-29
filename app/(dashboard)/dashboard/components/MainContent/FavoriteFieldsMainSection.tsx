"use client";

import { Star } from "lucide-react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FieldCardProps {
  id: string;
  name: string;
  image: string;
  favorited: boolean;
  onToggleFavorite?: () => void;
}

function FieldCard({ id, name, image, favorited, onToggleFavorite }: FieldCardProps) {
  return (
    <Card className="overflow-hidden cursor-pointer group hover:border-primary/50 transition-colors">
      <div className="relative aspect-square">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover group-hover:opacity-75 transition-opacity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.();
          }}
          className="absolute top-2 right-2"
        >
          <Star 
            className={`h-5 w-5 ${favorited ? "fill-primary text-primary" : "text-muted-foreground"}`} 
          />
        </button>
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="text-sm font-semibold text-foreground">{name}</p>
        </div>
      </div>
    </Card>
  );
}

// Mock data
const mockFavoriteFields = [
  {
    id: "1",
    name: "Iron Sights Alpha",
    image: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=500&h=300&fit=crop",
    favorited: true,
  },
  {
    id: "2",
    name: "The Boneyard",
    image: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=500&h=300&fit=crop",
    favorited: true,
  },
];

export function FavoriteFieldsMainSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Favorite Fields</h2>
        <p className="text-xs text-muted-foreground uppercase">NEWLY FAVORITED</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {mockFavoriteFields.map((field) => (
          <FieldCard 
            key={field.id} 
            {...field}
            onToggleFavorite={() => {}}
          />
        ))}
      </div>
    </div>
  );
}
