"use client";

import { useState } from "react";
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

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.name, email: data.email, password: data.password }),
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.message || "Something went wrong");
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      setError(err.message);
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
            <Image src="/logo-learn.png" alt="LearnPathX Logo" width={40} height={40} className="object-contain" />
            <span className="text-2xl font-bold tracking-tight">LearnPathX</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-white">Begin your mastery today.</h1>
          <p className="text-lg text-muted-foreground">Join thousands of developers leveling up their skills. Follow structured roadmaps, track your progress, and build your future.</p>
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
        <div className="absolute inset-0 bg-gradient-to-tl from-primary/5 via-transparent to-transparent lg:hidden" />
        
        <div className="relative w-full max-w-sm flex flex-col py-8">
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors self-start">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
          
          <div className="text-center mb-8">
            <div className="lg:hidden mx-auto flex h-12 w-12 items-center justify-center mb-4">
              <Image src="/logo-learn.png" alt="LearnPathX Logo" width={48} height={48} className="object-contain" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Create an account</h2>
            <p className="text-sm text-muted-foreground">Start your learning journey with LearnPathX</p>
          </div>

          {success ? (
            <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-4 text-sm text-green-400 text-center shadow-lg">
              ✅ Account created successfully! Redirecting to login...
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" {...register("name")} className={errors.name ? "border-red-500 focus-visible:ring-red-500" : "bg-white/5"} />
                {errors.name && <p className="text-sm text-red-400">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input id="email" type="email" placeholder="you@example.com" {...register("email")} className={errors.email ? "border-red-500 focus-visible:ring-red-500" : "bg-white/5"} />
                {errors.email && <p className="text-sm text-red-400">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" {...register("password")} className={errors.password ? "border-red-500 focus-visible:ring-red-500" : "bg-white/5"} />
                {errors.password && <p className="text-sm text-red-400">{errors.password.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" type="password" placeholder="••••••••" {...register("confirmPassword")} className={errors.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : "bg-white/5"} />
                {errors.confirmPassword && <p className="text-sm text-red-400">{errors.confirmPassword.message}</p>}
              </div>
              {error && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">{error}</div>
              )}
              <Button type="submit" className="w-full font-semibold shadow-lg shadow-primary/20 mt-2" disabled={isSubmitting}>
                {isSubmitting ? "Creating account..." : "Sign Up"}
              </Button>
            </form>
          )}

          <p className="text-center text-sm text-muted-foreground mt-8">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-primary hover:text-primary/80 transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
