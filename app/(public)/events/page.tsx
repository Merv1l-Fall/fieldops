"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getOpenEvents } from "@/app/actions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Event } from "@/lib/database.types";
import { Compass, Calendar, MapPin, Users, DollarSign } from "lucide-react";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const result = await getOpenEvents();
        setEvents(result || []);
      } catch (err) {
        setError("Failed to load events");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-black dark:to-zinc-900 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <p className="text-zinc-600 dark:text-zinc-400">Loading events...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-black dark:to-zinc-900 py-12">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 flex justify-center">
            <Compass className="h-12 w-12 text-primary" />
          </div>
          <h1 className="mb-4 text-4xl font-bold text-zinc-900 dark:text-white">
            Explore Airsoft Games
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Find and book your next airsoft operation
          </p>
        </div>

        {/* Error State */}
        {error && (
          <Card className="mb-8 border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
            <p className="text-red-700 dark:text-red-200">{error}</p>
          </Card>
        )}

        {/* Empty State */}
        {events.length === 0 && !error && (
          <div className="text-center">
            <Card className="p-12">
              <Compass className="mx-auto mb-4 h-12 w-12 text-zinc-300" />
              <h2 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-white">
                No events available
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                Check back soon for upcoming airsoft operations
              </p>
            </Card>
          </div>
        )}

        {/* Events Grid */}
        {events.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => {
              const eventDate = new Date(event.date);
              const spotsRemaining = event.max_players; // Note: This is approximate, actual count needs booking query
              const isFull = spotsRemaining <= 0;
              const isCancelled = event.status === "cancelled";

              return (
                <Card
                  key={event.id}
                  className="overflow-hidden transition-all hover:shadow-lg hover:ring-2 hover:ring-primary/50"
                >
                  <div className="p-6">
                    {/* Title & Status */}
                    <div className="mb-4 flex items-start justify-between gap-2">
                      <h3 className="text-lg font-bold text-zinc-900 dark:text-white line-clamp-2">
                        {event.name}
                      </h3>
                      <div className="flex gap-1">
                        {isCancelled && (
                          <Badge variant="destructive">Cancelled</Badge>
                        )}
                        {event.payment_mode === "online" && (
                          <Badge variant="secondary">Online Pay</Badge>
                        )}
                      </div>
                    </div>

                    {/* Event Details */}
                    <div className="mb-6 space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
                      {/* Date & Time */}
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 flex-shrink-0" />
                        <span>
                          {eventDate.toLocaleDateString("sv-SE", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}{" "}
                          at{" "}
                          {eventDate.toLocaleTimeString("sv-SE", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      {/* Price */}
                      {event.price_cents > 0 ? (
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 flex-shrink-0" />
                          <span>
                            {(event.price_cents / 100).toFixed(2)} SEK
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 flex-shrink-0" />
                          <span className="font-semibold text-green-600 dark:text-green-400">
                            Free
                          </span>
                        </div>
                      )}

                      {/* Capacity */}
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 flex-shrink-0" />
                        <span>
                          Max {event.max_players} players
                        </span>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex gap-2">
                      <Link
                        href={`/events/${event.id}`}
                        className="flex-1"
                      >
                        <Button
                          disabled={isCancelled}
                          className="w-full"
                          variant="default"
                        >
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
