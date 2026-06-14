"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setError(null);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
      } else if (result?.ok) {
        window.location.href = "/dashboard";
      } else {
        alert("Login failed, but no specific error returned. Result: " + JSON.stringify(result));
      }
    } catch (e: any) {
      alert("Terjadi error fatal saat request: " + e.message);
      setError(e.message);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 relative overflow-hidden border-r border-white/10 bg-black/50 lg:sticky lg:top-0 lg:h-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/5 pointer-events-none" />
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-primary/20 blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 mb-12">
          <Link href="/" className="inline-flex items-center gap-2 transition-transform hover:scale-105">
            <Image src="/logo-learn.png" alt="LearnPathXX Logo" width={40} height={40} className="object-contain" />
            <span className="text-2xl font-bold tracking-tight">LearnPathXX</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-white">Welcome back to your learning journey.</h1>
          <p className="text-lg text-muted-foreground">Pick up where you left off. Continue conquering roadmaps, tracking progress, and unlocking achievements.</p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent lg:hidden" />
        
        <div className="relative w-full max-w-sm flex flex-col">
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors self-start">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
          
          <div className="text-center mb-8">
            <div className="lg:hidden mx-auto flex h-12 w-12 items-center justify-center mb-4">
              <Image src="/logo-learn.png" alt="LearnPathXX Logo" width={48} height={48} className="object-contain" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Sign In</h2>
            <p className="text-sm text-muted-foreground">Enter your email and password to access your account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input id="email" type="email" placeholder="you@example.com" {...register("email")} className={errors.email ? "border-red-500 focus-visible:ring-red-500" : "bg-white/5"} />
              {errors.email && <p className="text-sm text-red-400">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input id="password" type="password" placeholder="••••••••" {...register("password")} className={errors.password ? "border-red-500 focus-visible:ring-red-500" : "bg-white/5"} />
              {errors.password && <p className="text-sm text-red-400">{errors.password.message}</p>}
            </div>
            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">{error}</div>
            )}
            <Button type="submit" className="w-full font-semibold shadow-lg shadow-primary/20" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Don't have an account?{" "}
            <Link href="/register" className="font-semibold text-primary hover:text-primary/80 transition-colors">Sign up for free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
