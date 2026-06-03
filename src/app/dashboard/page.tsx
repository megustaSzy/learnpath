import { auth } from "@/auth";
import { getUserDashboardStats, getAdminDashboardStats, getSuperAdminStats } from "@/lib/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Map, BookOpen, Target, Trophy, Users, FileText, TrendingUp } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  const role = (session?.user as any)?.role;

  if (role === "SUPER_ADMIN") {
    return <SuperAdminDashboard />;
  }
  if (role === "ADMIN") {
    return <AdminDashboard />;
  }
  return <UserDashboard />;
}

async function UserDashboard() {
  const stats = await getUserDashboardStats();

  const statCards = [
    { label: "Roadmaps Joined", value: stats.roadmapsJoined, icon: Map, color: "text-blue-400" },
    { label: "Topics Completed", value: stats.topicsCompleted, icon: BookOpen, color: "text-green-400" },
    { label: "Goals Completed", value: `${stats.completedGoals}/${stats.totalGoals}`, icon: Target, color: "text-amber-400" },
    { label: "Achievements", value: stats.achievementCount, icon: Trophy, color: "text-purple-400" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your learning overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-1 text-3xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`h-10 w-10 ${stat.color} opacity-80`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Roadmap Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">My Roadmaps</CardTitle>
          <CardDescription>Track your learning progress across roadmaps</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.roadmapProgress.length === 0 ? (
            <div className="text-center py-8">
              <Map className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">You haven't joined any roadmaps yet.</p>
              <Link href="/dashboard/roadmaps" className="mt-2 inline-block text-primary hover:underline text-sm font-medium">
                Browse Roadmaps →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.roadmapProgress.map((rp) => (
                <Link key={rp.id} href={`/dashboard/progress/${rp.slug}`} className="block">
                  <div className="flex items-center gap-4 rounded-lg border p-4 hover:bg-accent/50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">{rp.title}</p>
                        <Badge variant="outline" className="shrink-0 text-xs">{rp.difficulty}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{rp.category} · {rp.completedTopics}/{rp.totalTopics} topics</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="w-32 h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${rp.progress}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold w-10 text-right">{rp.progress}%</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentActivity.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-4">No recent activity</p>
          ) : (
            <div className="space-y-3">
              {stats.recentActivity.map((log) => (
                <div key={log.id} className="flex items-start gap-3 text-sm">
                  <div className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
                  <div className="flex-1">
                    <p>{log.activity}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(log.createdAt).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

async function AdminDashboard() {
  const stats = await getAdminDashboardStats();
  const statCards = [
    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-blue-400" },
    { label: "Total Roadmaps", value: stats.totalRoadmaps, icon: Map, color: "text-green-400" },
    { label: "Total Topics", value: stats.totalTopics, icon: FileText, color: "text-amber-400" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage roadmaps and content.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-1 text-3xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`h-10 w-10 ${stat.color} opacity-80`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Popular Roadmaps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.popularRoadmaps.map((r: any) => (
              <div key={r.id} className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">{r.title}</p>
                  <p className="text-xs text-muted-foreground">{r.category.name}</p>
                </div>
                <Badge variant="secondary">{r._count.userRoadmaps} users</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

async function SuperAdminDashboard() {
  const stats = await getSuperAdminStats();
  const statCards = [
    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-blue-400" },
    { label: "Total Admins", value: stats.totalAdmins, icon: Shield, color: "text-green-400" },
    { label: "Total Roadmaps", value: stats.totalRoadmaps, icon: Map, color: "text-amber-400" },
    { label: "Active Users", value: stats.activeUsers, icon: TrendingUp, color: "text-purple-400" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
        <p className="text-muted-foreground">System overview and management.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-1 text-3xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`h-10 w-10 ${stat.color} opacity-80`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">New Registrations (30 days)</p>
              <p className="text-3xl font-bold mt-1">{stats.newRegistrations}</p>
            </div>
            <Users className="h-10 w-10 text-blue-400 opacity-80" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Shield(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>
  );
}
