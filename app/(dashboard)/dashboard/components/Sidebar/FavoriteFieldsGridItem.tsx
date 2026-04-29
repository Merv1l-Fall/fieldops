"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";

interface FavoriteFieldsGridItemProps {
  id: string;
  name: string;
  image: string;
  players?: number;
}

export function FavoriteFieldsGridItem({
  id,
  name,
  image,
  players = 0,
}: FavoriteFieldsGridItemProps) {
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
        <div className="absolute bottom-0 left-0 right-0 p-2">
          <p className="text-xs font-semibold text-foreground">{name}</p>
          <p className="text-xs text-muted-foreground">{players} players</p>
        </div>
      </div>
    </Card>
  );
}
