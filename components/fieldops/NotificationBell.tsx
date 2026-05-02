"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, getUserNotifications, getUnreadNotifications } from "@/app/actions";
import { Notification } from "@/lib/database.types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface NotificationBellProps {
  userId?: string;
}

export function NotificationBell({ userId }: NotificationBellProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadNotifications = async () => {
      if (!userId) return;

      setIsLoading(true);
      try {
        const unread = await getUnreadNotifications(userId);
        setNotifications(unread);
        setUnreadCount(unread.length);
      } catch (error) {
        console.error("Failed to load notifications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotifications();

    // Polling interval - check every 30 seconds
    const interval = setInterval(loadNotifications, 30000);

    return () => clearInterval(interval);
  }, [userId]);

  if (!userId) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-zinc-100 rounded-lg transition-colors"
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <Card className="absolute right-0 mt-2 w-80 shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-zinc-200">
            <h3 className="font-semibold text-zinc-900">Notifications</h3>
          </div>

          {isLoading ? (
            <div className="p-4 text-center text-sm text-zinc-600">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-zinc-600">
              No new notifications
            </div>
          ) : (
            <div className="divide-y divide-zinc-200">
              {notifications.map((notification) => (
                <div key={notification.created_at} className="p-4 hover:bg-zinc-50">
                  <p className="text-xs text-zinc-500 mb-1">
                    {new Date(notification.created_at).toLocaleString("sv-SE")}
                  </p>
                  <p className="text-sm text-zinc-900">{notification.message}</p>
                  <p className="text-xs text-zinc-600 mt-1">Type: {notification.type}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
