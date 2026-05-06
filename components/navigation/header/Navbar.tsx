"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/lib/store/userStore";
import { useLogout } from "@/lib/hooks/useLogout";
import MobileMenu from "./MobileMenu";
import { Menu, LogOut, Settings } from "lucide-react";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isLoading } = useUserStore();
  const { logout } = useLogout();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      <nav className="flex h-16 items-center justify-between" aria-label="Main navigation">
        {/* Left: Logo/Brand */}
        <div className="flex items-center">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="text-xl font-bold text-primary">FieldOps</div>
          </Link>
        </div>

        {/* Center: Desktop Navigation Links */}
        <div className="hidden flex-1 items-center justify-center gap-8 md:flex">
			{user && (
				<>
			  <Link
				href="/dashboard"
				className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
			  >
				Dashboard
			  </Link>
          <Link
		  href="/events"
		  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Explore Games
          </Link>
		  </>
		)}
        </div>

        {/* Right: Desktop User Menu */}
        <div className="hidden items-center gap-4 md:flex">
          {!isLoading && (
            <>
              {user ? (
                <>
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col items-end">
                      <p className="text-sm font-medium text-foreground">{user.username ? user.username : user.full_name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    title="Logout"
                  >
                    <LogOut className="size-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                  <Link href="/register">
                    <Button>Sign Up</Button>
                  </Link>
                </>
              )}
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <Menu className="size-5" />
        </Button>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu open={mobileMenuOpen} setOpen={setMobileMenuOpen} />
    </>
  );
};

export default Navbar;
