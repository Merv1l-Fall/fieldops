"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/lib/store/userStore";
import { useLogout } from "@/lib/hooks/useLogout";
import { AUTH_ROUTES, DASHBOARD_ROUTES, PUBLIC_ROUTES, DEFAULT_REDIRECTS } from "@/lib/constants/routes";
import { X, LogOut } from "lucide-react";

interface MobileMenuProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const MobileMenu = ({ open, setOpen }: MobileMenuProps) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const { user } = useUserStore();
  const { logout } = useLogout();

  // Auto-focus close button when menu opens
  useEffect(() => {
    if (open && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [open]);

  // Close menu when escape key is pressed
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, setOpen]);

  const handleLogout = async () => {
    await logout();
    setOpen(false);
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={() => setOpen(false)}
        role="presentation"
      />

      {/* Mobile Menu Panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-background shadow-lg">
        <div className="flex h-full flex-col">
          {/* Header with close button */}
          <div className="flex items-center justify-between border-b border-border px-4 py-4">
            <h2 className="text-lg font-semibold">Menu</h2>
            <Button
              ref={closeButtonRef}
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              <X className="size-5" />
            </Button>
          </div>

          {/* Menu Content */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {user ? (
              <div className="space-y-4">
                {/* User Info */}
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-sm font-medium text-foreground">{user.full_name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>

                {/* Navigation Links */}
                <nav className="space-y-2">
                  <Link href={DASHBOARD_ROUTES.HOME} onClick={() => setOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      Home
                    </Button>
                  </Link>
                  <Link href="/settings" onClick={() => setOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      Settings
                    </Button>
                  </Link>
                </nav>

                {/* Logout Button */}
                <div className="border-t border-border pt-4">
                  <Button
                    variant="destructive"
                    className="w-full justify-start"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 size-4" />
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Link href={AUTH_ROUTES.LOGIN} onClick={() => setOpen(false)}>
                  <Button className="w-full">Sign In</Button>
                </Link>
                <Link href={AUTH_ROUTES.REGISTER} onClick={() => setOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
