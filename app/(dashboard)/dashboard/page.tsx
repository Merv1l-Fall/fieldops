"use client";

import { useUserStore } from "@/lib/store/userStore";
import { Card } from "@/components/ui/card";

export default function DashboardPage() {
  const { user } = useUserStore();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.full_name}!</h1>
          <p className="text-muted-foreground mt-2">Here's what's happening with your account.</p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Card 1 */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-2">Quick Stats</h3>
            <p className="text-muted-foreground text-sm">Your dashboard stats will appear here</p>
          </Card>

          {/* Card 2 */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-2">Recent Activity</h3>
            <p className="text-muted-foreground text-sm">Activity feed coming soon</p>
          </Card>

          {/* Card 3 */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-2">Quick Actions</h3>
            <p className="text-muted-foreground text-sm">Actions will be available here</p>
          </Card>
        </div>

        {/* Account Info */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Account Information</h2>
          <div className="space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Full Name</p>
              <p className="font-medium">{user?.full_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Member Since</p>
              <p className="font-medium">
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
