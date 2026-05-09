"use client";

import { useState } from "react";
import Link from "next/link";
import { DASHBOARD_ROUTES, PUBLIC_ROUTES } from "@/lib/constants/routes";
import { Field, EventWithField } from "@/lib/database.types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface OwnerDashboardProps {
  userId: string;
  fields: Field[];
  events: EventWithField[];
}

export function OwnerDashboard({ userId, fields, events }: OwnerDashboardProps) {
  const [selectedField, setSelectedField] = useState<string | null>(
    fields[0]?.id || null
  );

  const selectedFieldEvents = events.filter(
    (event) => event.field_id === selectedField
  );

  const upcomingEvents = selectedFieldEvents.filter(
    (event) => new Date(event.date) > new Date()
  );

  const pastEvents = selectedFieldEvents.filter(
    (event) => new Date(event.date) <= new Date()
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-zinc-900 mb-2">Owner Dashboard</h1>
          <p className="text-lg text-zinc-600">Manage your fields and events</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Link href={DASHBOARD_ROUTES.CREATE_FIELD}>
            <Button className="w-full" size="lg">
              + Create Field
            </Button>
          </Link>
          <Link href={DASHBOARD_ROUTES.CREATE_EVENT}>
            <Button className="w-full" size="lg">
              + Create Event
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar - Fields List */}
          <div>
            <Card className="p-4 sticky top-4">
              <h2 className="font-semibold text-zinc-900 mb-4">Your Fields</h2>
              <div className="space-y-2">
                {fields.length === 0 ? (
                  <p className="text-sm text-zinc-500">No fields yet</p>
                ) : (
                  fields.map((field) => (
                    <button
                      key={field.id}
                      onClick={() => setSelectedField(field.id)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        selectedField === field.id
                          ? "bg-zinc-900 text-white"
                          : "bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
                      }`}
                    >
                      <div className="font-semibold truncate">{field.name}</div>
                      <div className="text-xs truncate opacity-75">{field.location}</div>
                    </button>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {!selectedField ? (
              <Card className="p-8 text-center">
                <p className="text-zinc-600">Create your first field to get started</p>
              </Card>
            ) : (
              <div className="space-y-8">
                {/* Upcoming Events */}
                <div>
                  <h2 className="text-2xl font-bold text-zinc-900 mb-4">
                    Upcoming Events ({upcomingEvents.length})
                  </h2>
                  <div className="grid gap-4">
                    {upcomingEvents.length === 0 ? (
                      <Card className="p-6 text-center">
                        <p className="text-zinc-600 mb-4">
                          No upcoming events scheduled
                        </p>
                        <Link href={DASHBOARD_ROUTES.CREATE_EVENT}>
                          <Button size="sm">Create Event</Button>
                        </Link>
                      </Card>
                    ) : (
                      upcomingEvents.map((event) => (
                        <EventCard key={event.id} event={event} />
                      ))
                    )}
                  </div>
                </div>

                {/* Past Events */}
                {pastEvents.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-zinc-900 mb-4">
                      Past Events ({pastEvents.length})
                    </h2>
                    <div className="grid gap-4">
                      {pastEvents.map((event) => (
                        <EventCard key={event.id} event={event} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EventCard({ event }: { event: EventWithField }) {
  const eventDate = new Date(event.date);
  const isUpcoming = eventDate > new Date();

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900">{event.name}</h3>
          <p className="text-sm text-zinc-600">
            {eventDate.toLocaleDateString("sv-SE", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <Badge variant={isUpcoming ? "default" : "secondary"}>
          {event.status}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <p className="text-zinc-600">Price</p>
          <p className="font-semibold">{(event.price_cents / 100).toFixed(2)} SEK</p>
        </div>
        <div>
          <p className="text-zinc-600">Max Players</p>
          <p className="font-semibold">{event.max_players}</p>
        </div>
      </div>

      <div className="flex gap-2 pt-4 border-t border-zinc-200">
        <Link href={PUBLIC_ROUTES.EVENT_DETAIL(event.id)} className="flex-1">
          <Button variant="outline" size="sm" className="w-full">
            View Public
          </Button>
        </Link>
        <Button variant="outline" size="sm" className="flex-1">
          Edit
        </Button>
      </div>
    </Card>
  );
}
