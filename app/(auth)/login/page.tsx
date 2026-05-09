"use client";

import Link from "next/link";
import { LoginForm } from "@/components/forms/LoginForm";
import { AUTH_ROUTES } from "@/lib/constants/routes";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Welcome Back
          </h1>
          <p className="text-muted-foreground text-sm md:text-base mt-2">
            Sign in to your account to continue
          </p>
        </div>

        <LoginForm />

        {/* Sign Up Link */}
        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <Link
            href={AUTH_ROUTES.REGISTER}
            className="font-semibold text-primary hover:underline underline-offset-4"
          >
            Sign up
          </Link>
        </div>

        {/* Footer Text */}
        <p className="text-xs text-muted-foreground text-center mt-4">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}