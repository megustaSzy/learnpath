import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Map, BookOpen, Target, Trophy, ArrowRight, CheckCircle } from "lucide-react";

export default function HomePage() {
  const features = [
    { icon: Map, title: "Structured Roadmaps", description: "Follow curated learning paths designed by industry experts." },
    { icon: BookOpen, title: "Progress Tracking", description: "Track your progress in real-time across multiple roadmaps." },
    { icon: Target, title: "Weekly Goals", description: "Set and achieve weekly learning targets to stay consistent." },
    { icon: Trophy, title: "Achievements", description: "Earn badges and achievements as you complete milestones." },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-6 flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-transparent">
              <Image src="/logo-learn.png" alt="LearnPathX Logo" width={32} height={32} className="object-contain" />
            </div>
            <span className="text-xl font-bold tracking-tight">LearnPathX</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm mb-6 bg-primary/10 text-primary border-primary/20">
            <CheckCircle className="h-4 w-4" /> Developer Roadmap Tracker
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
            Navigate Your
            <span className="premium-gradient-text"> Developer Journey</span>
            <br />With Confidence
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            LearnPathX helps developers plan, track, and complete their learning roadmaps.
            Set goals, earn achievements, and monitor your progress with an interactive dashboard.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="gap-2">
                Start Learning <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">Sign In</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Everything You Need to Learn</h2>
            <p className="mt-3 text-muted-foreground">Powerful tools to accelerate your developer career</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="group rounded-xl border p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-200 hover:-translate-y-0.5 bg-card">
                <feature.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-3xl text-center rounded-2xl border bg-gradient-to-b from-primary/10 to-transparent p-12">
          <h2 className="text-3xl font-bold">Ready to Start Your Journey?</h2>
          <p className="mt-3 text-muted-foreground">
            Join developers who are learning smarter and tracking their progress with LearnPathX.
          </p>
          <Link href="/register">
            <Button size="lg" className="mt-6 gap-2">
              Create Free Account <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-6">
        <div className="mx-auto max-w-6xl flex items-center justify-between text-sm text-muted-foreground">
          <p>© 2026 LearnPathX. Built by Raditya Ahmad.</p>
          <div className="flex gap-4">
            <Link href="/login" className="hover:text-foreground transition-colors">Login</Link>
            <Link href="/register" className="hover:text-foreground transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
