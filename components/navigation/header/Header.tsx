"use client";

import Navbar from "./Navbar";

const Header = () => {
  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      role="banner"
    >
      <div className="mx-auto max-w-7xl px-4">
        <Navbar />
      </div>
    </header>
  );
};

export default Header;
