"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/client";
import { useUserStore } from "@/lib/store/userStore";
import { AUTH_ROUTES, DASHBOARD_ROUTES } from "@/lib/constants/routes";
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
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { setUser } = useUserStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null);
      if (onEmailLogin) {
        await onEmailLogin(data);
      } else {
        // Default Supabase email login
        const supabase = createClient();
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

        if (authError) {
          setError(authError.message);
          return;
        }

        if (authData.user) {
          setUser({
            id: authData.user.id,
            email: authData.user.email || "",
            full_name: authData.user.user_metadata?.full_name || authData.user.email?.split("@")[0] || "",
            avatar_url: authData.user.user_metadata?.avatar_url,
            created_at: authData.user.created_at,
          });
          router.push(DASHBOARD_ROUTES.HOME);
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      console.error("Login error:", err);
    }
  };

  const handleOAuthClick = async (provider: "google" | "apple") => {
    setIsOAuthLoading(true);
    try {
      setError(null);
      if (onOAuthLogin) {
        await onOAuthLogin(provider);
      } else {
        // Default Supabase OAuth login
        const supabase = createClient();
        const { error: oauthError } = await supabase.auth.signInWithOAuth({
          provider: provider as "google" | "apple",
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (oauthError) {
          setError(oauthError.message);
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      console.error("OAuth error:", err);
    } finally {
      setIsOAuthLoading(false);
    }
  };

  const isLoading = isSubmitting || isOAuthLoading;

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Error Display */}
        {error && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
            {error}
          </div>
        )}

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
