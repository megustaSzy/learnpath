import { getPublicProfile } from "@/lib/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ExternalLink, Link2, Calendar, Flame, Trophy, Map as MapIcon, Activity, GitBranch } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function PublicProfilePage({ params }: { params: { id: string } }) {
  const profile = await getPublicProfile(params.id);

  if (!profile) {
    notFound();
  }

  const initials = profile.name.split(" ").map((n) => n[0]).join("").toUpperCase();

  // Deduplicate roadmaps for display
  const completedRoadmaps = new Map<string, any>();
  profile.topicProgress.forEach(tp => {
    const rm = tp.topic.roadmap;
    if (!completedRoadmaps.has(rm.slug)) {
      completedRoadmaps.set(rm.slug, rm);
    }
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 w-full z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-6 flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">LearnPath</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-sm font-medium hover:underline text-muted-foreground hover:text-foreground">
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Cover Gradient */}
      <div className="h-48 w-full bg-gradient-to-r from-primary/20 via-blue-500/20 to-purple-500/20 absolute top-0 left-0 right-0 -z-10" />

      <main className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        <div className="grid gap-6 lg:grid-cols-3">
          
          {/* Left Column: Profile Info & Streak */}
          <div className="space-y-6">
            <Card className="border-border/50 shadow-sm bg-background/60 backdrop-blur-xl">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Avatar className="h-32 w-32 mb-6 ring-4 ring-background shadow-xl">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground text-4xl font-bold">{initials}</AvatarFallback>
                </Avatar>
                <h1 className="text-2xl font-bold tracking-tight">{profile.name}</h1>
                {profile.githubUsername && (
                  <p className="text-sm font-medium text-muted-foreground mt-1 bg-muted px-2 py-0.5 rounded-md">@{profile.githubUsername}</p>
                )}
                
                {profile.bio && <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{profile.bio}</p>}
                
                <div className="mt-6 space-y-3 w-full border-t pt-6 text-left">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" /> Joined {new Date(profile.createdAt).toLocaleDateString()}
                  </div>
                  {profile.githubUrl && (
                    <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-primary hover:underline">
                      <GitBranch className="h-4 w-4" /> GitHub Profile
                    </a>
                  )}
                  {profile.linkedinUrl && (
                    <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-primary hover:underline">
                      <ExternalLink className="h-4 w-4" /> LinkedIn Profile
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Streak Card */}
            <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-500 mb-1">Learning Streak</p>
                  <p className="text-3xl font-bold flex items-center gap-2">
                    {profile.streakCount} <span className="text-lg font-normal text-muted-foreground">days</span>
                  </p>
                </div>
                <Flame className={`h-12 w-12 ${profile.streakCount > 0 ? 'text-orange-500 animate-pulse' : 'text-muted-foreground/30'}`} />
              </CardContent>
            </Card>
            
            {/* GitHub Repos attached (If we use it later) */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2"><GitBranch className="h-4 w-4" /> Topic Projects</CardTitle>
              </CardHeader>
              <CardContent>
                {profile.topicProgress.filter(tp => tp.githubRepoUrl).length === 0 ? (
                  <p className="text-sm text-muted-foreground">No projects attached yet.</p>
                ) : (
                  <ul className="space-y-3">
                    {profile.topicProgress.filter(tp => tp.githubRepoUrl).map(tp => (
                      <li key={tp.id} className="text-sm">
                        <p className="font-medium truncate">{tp.topic.title}</p>
                        <a href={tp.githubRepoUrl!} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1 mt-1">
                          <Link2 className="h-3 w-3" /> View Source
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Achievements, Roadmaps, Activity */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg"><Trophy className="h-5 w-5 text-yellow-500" /> Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                {profile.achievements.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No achievements earned yet.</p>
                ) : (
                  <ul className="grid gap-4 sm:grid-cols-2">
                    {profile.achievements.map((ua) => (
                      <li key={ua.id} className="flex gap-4 p-3 rounded-lg border bg-card/50">
                        <div className="text-3xl" aria-hidden="true">{ua.achievement.badgeIcon}</div>
                        <div>
                          <p className="font-semibold text-sm">{ua.achievement.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{ua.achievement.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            {/* Completed Topics / Roadmaps summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg"><MapIcon className="h-5 w-5 text-blue-400" /> Roadmap Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6 flex gap-8">
                  <div>
                    <p className="text-3xl font-bold">{profile.topicProgress.length}</p>
                    <p className="text-sm text-muted-foreground">Topics Completed</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{completedRoadmaps.size}</p>
                    <p className="text-sm text-muted-foreground">Active Roadmaps</p>
                  </div>
                </div>
                
                {completedRoadmaps.size > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {Array.from(completedRoadmaps.values()).map(rm => (
                      <Badge key={rm.slug} variant="secondary" className="px-3 py-1">
                        {rm.title}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg"><Activity className="h-5 w-5 text-green-400" /> Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {profile.activityLogs.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No recent activity.</p>
                ) : (
                  <ul className="space-y-4">
                    {profile.activityLogs.map((log) => (
                      <li key={log.id} className="flex items-start gap-3 text-sm">
                        <div className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
                        <div className="flex-1">
                          <p>{log.activity}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(log.createdAt).toLocaleDateString("en-US", {
                              month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                            })}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

          </div>
        </div>
      </main>
    </div>
  );
}
