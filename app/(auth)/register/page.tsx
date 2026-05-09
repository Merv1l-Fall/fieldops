"use client";

import Link from "next/link";
import { RegisterForm } from "@/components/forms/RegisterForm";
import { AUTH_ROUTES } from "@/lib/constants/routes";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Create Account
          </h1>
          <p className="text-muted-foreground text-sm md:text-base mt-2">
            Sign up to get started
          </p>
        </div>

        {/* Register Card */}
        <RegisterForm />

        {/* Sign In Link */}
        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <Link
            href={AUTH_ROUTES.LOGIN}
            className="font-semibold text-primary hover:underline underline-offset-4"
          >
            Sign in
          </Link>
        </div>

        {/* Footer Text */}
        <p className="text-xs text-muted-foreground text-center mt-4">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
