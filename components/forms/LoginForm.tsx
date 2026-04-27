"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Apple, Globe, Mail, Lock, Loader2 } from "lucide-react";

// Validation Schema
const loginSchema = z.object({
  email: z
    .email("Invalid email address")
    .min(1, "Email is required"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onOAuthLogin?: (provider: "google" | "apple") => Promise<void>;
  onEmailLogin?: (data: LoginFormData) => Promise<void>;
}

export function LoginForm({ onOAuthLogin, onEmailLogin }: LoginFormProps) {
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      if (onEmailLogin) {
        await onEmailLogin(data);
      } else {
        console.log("Login with:", data);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleOAuthClick = async (provider: "google" | "apple") => {
    setIsOAuthLoading(true);
    try {
      if (onOAuthLogin) {
        await onOAuthLogin(provider);
      } else {
        console.log("Login with:", provider);
      }
    } finally {
      setIsOAuthLoading(false);
    }
  };

  const isLoading = isSubmitting || isOAuthLoading;

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              disabled={isLoading}
              className={`pl-10 py-5 ${errors.email ? "border-destructive" : ""}`}
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              disabled={isLoading}
              className={`pl-10 py-5 ${errors.password ? "border-destructive" : ""}`}
              {...register("password")}
            />
          </div>
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        {/* Forgot Password Link */}
        <div className="text-right">
          <Link
            href="#"
            className="text-xs text-primary hover:underline underline-offset-4"
          >
            Forgot password?
          </Link>
        </div>

        {/* Sign In Button */}
        <Button type="submit" disabled={isLoading} className="w-full h-10">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      {/* OAuth Buttons */}
      <div className="space-y-3">
        <Button
          type="button"
          variant="outline"
          disabled={isOAuthLoading}
          onClick={() => handleOAuthClick("google")}
          className="w-full h-10"
        >
          <Globe className="mr-2 size-4" />
          Continue with Google
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isOAuthLoading}
          onClick={() => handleOAuthClick("apple")}
          className="w-full h-10"
        >
          <Apple className="mr-2 size-4" />
          Continue with Apple
        </Button>
      </div>
    </Card>
  );
}
