"use client";

import { Card } from "@/components/ui/card";
import { FavoriteFieldsGridItem } from "./FavoriteFieldsGridItem";
import { Button } from "@/components/ui/button";

// Mock data - replace with actual data from Supabase
const mockFavoriteFields = [
  {
    id: "1",
    name: "Iron Sights Alpha",
    image: "https://www.airsoft.nu/nyheter/files/2019/05/igel_kotten_spelbana_huddinge.jpg",
    players: 45,
  },
  {
    id: "2",
    name: "The Boneyard",
    image: "https://www.airsoft.nu/nyheter/files/2017/02/dalbybanan.jpg",
    players: 32,
  },
];

export function FavoriteFieldsGrid() {
  return (
    <Card className="p-4 space-y-3">
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
          Favorite Fields
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {mockFavoriteFields.map((field) => (
          <FavoriteFieldsGridItem key={field.id} {...field} />
        ))}
      </div>

      <Button 
        variant="outline" 
        size="sm"
        className="w-full text-xs"
      >
        VIEW COMPLETE MAP
      </Button>
    </Card>
  );
}
