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
import { Apple, Globe, Mail, Lock, User, Loader2 } from "lucide-react";

// Validation Schema
const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .min(2, "Name must be at least 2 characters"),
    email: z.email("Invalid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain an uppercase letter")
      .regex(/[0-9]/, "Password must contain a number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onOAuthSignup?: (provider: "google" | "apple") => Promise<void>;
  onEmailSignup?: (data: RegisterFormData) => Promise<void>;
}

export function RegisterForm({
  onOAuthSignup,
  onEmailSignup,
}: RegisterFormProps) {
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      if (onEmailSignup) {
        await onEmailSignup(data);
      } else {
        console.log("Sign up with:", data);
      }
    } catch (error) {
      console.error("Sign up error:", error);
    }
  };

  const handleOAuthClick = async (provider: "google" | "apple") => {
    setIsOAuthLoading(true);
    try {
      if (onOAuthSignup) {
        await onOAuthSignup(provider);
      } else {
        console.log("Sign up with:", provider);
      }
    } finally {
      setIsOAuthLoading(false);
    }
  };

  const isLoading = isSubmitting || isOAuthLoading;

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              disabled={isLoading}
              className={`pl-10 py-5 ${errors.name ? "border-destructive" : ""}`}
              {...register("name")}
            />
          </div>
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

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

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              disabled={isLoading}
              className={`pl-10 py-5 ${
                errors.confirmPassword ? "border-destructive" : ""
              }`}
              {...register("confirmPassword")}
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Sign Up Button */}
        <Button type="submit" disabled={isLoading} className="w-full h-10">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create Account"
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
            Or sign up with
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
          Sign up with Google
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isOAuthLoading}
          onClick={() => handleOAuthClick("apple")}
          className="w-full h-10"
        >
          <Apple className="mr-2 size-4" />
          Sign up with Apple
        </Button>
      </div>
    </Card>
  );
}
