
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ClientProviders } from "@/components/ClientProviders";
import Header from "@/components/navigation/header/Header";

const robotoHeading = Roboto({subsets:['latin'],variable:'--font-heading',weight:'700'});

const robotoSans = Roboto({subsets:['latin'],variable:'--font-sans',weight:['400','500','700']});

export const metadata: Metadata = {
  title: "FieldOps - Airsoft Event Management",
  description: "Book and manage airsoft field operations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("dark", "h-full", "antialiased", "font-sans", robotoSans.variable, robotoHeading.variable)}
    >
      <body className="min-h-full flex flex-col">
        <ClientProviders>
          <Header />
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
