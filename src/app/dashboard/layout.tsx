"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import {
  LayoutDashboard, Map, FolderOpen, Target, Trophy, Bell,
  History, User, Users, Shield, LogOut, Menu, X, ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const userNav = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Roadmaps", href: "/dashboard/roadmaps", icon: Map },
  { label: "My Progress", href: "/dashboard/progress", icon: FolderOpen },
  { label: "Weekly Goals", href: "/dashboard/goals", icon: Target },
  { label: "Achievements", href: "/dashboard/achievements", icon: Trophy },
  { label: "Activity", href: "/dashboard/activity", icon: History },
  { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { label: "Profile", href: "/dashboard/profile", icon: User },
];

const adminNav = [
  { label: "Categories", href: "/dashboard/categories", icon: FolderOpen },
];

const superAdminNav = [
  { label: "User Management", href: "/dashboard/users", icon: Users },
  { label: "Admin Management", href: "/dashboard/admins", icon: Shield },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const role = (session?.user as any)?.role || "USER";
  const initials = session?.user?.name?.split(" ").map(n => n[0]).join("").toUpperCase() || "U";

  const navItems = [
    ...userNav,
    ...(role !== "USER" ? adminNav : []),
    ...(role === "SUPER_ADMIN" ? superAdminNav : []),
  ];

  const roleBadge = role === "SUPER_ADMIN" ? "Super Admin" : role === "ADMIN" ? "Admin" : "User";
  const roleColor = role === "SUPER_ADMIN" ? "destructive" : role === "ADMIN" ? "secondary" : "default";

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 flex flex-col
        bg-sidebar/80 backdrop-blur-2xl text-sidebar-foreground
        border-r border-white/5 shadow-2xl
        transform transition-transform duration-200 ease-in-out
        lg:relative lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex h-16 items-center justify-between px-5 border-b border-white/5">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-transparent">
              <Image src="/logo.png" alt="DevPath Logo" width={32} height={32} className="object-contain" />
            </div>
            <span className="text-lg font-bold tracking-tight">DevPath</span>
          </Link>
          <Button variant="ghost" size="icon" className="lg:hidden text-sidebar-foreground" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium
                  transition-all duration-150
                  ${isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }
                `}
              >
                <item.icon className="h-4.5 w-4.5 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="border-t border-white/5 p-3">
          <DropdownMenu>
            <DropdownMenuTrigger render={
              <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-sidebar-accent transition-colors">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium truncate">{session?.user?.name}</p>
                  <p className="text-xs text-sidebar-foreground/50 truncate">{session?.user?.email}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-sidebar-foreground/50" />
              </button>
            } />
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{session?.user?.name}</p>
                <Badge variant={roleColor as any} className="mt-1 text-xs">{roleBadge}</Badge>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem render={
                <Link href="/dashboard/profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              } />
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/login" })} className="text-red-400">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex h-16 items-center gap-4 border-b border-white/5 bg-background/50 backdrop-blur-xl px-6 sticky top-0 z-10">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex-1" />
          <Badge variant={roleColor as any} className="text-xs">{roleBadge}</Badge>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
