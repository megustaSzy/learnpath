import { getLeaderboard } from "@/lib/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Flame, Map as MapIcon } from "lucide-react";
import Link from "next/link";

export default async function LeaderboardPage() {
  const leaderboard = await getLeaderboard();

  return (
    <main className="space-y-8 max-w-4xl mx-auto pb-10">
      <header className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-yellow-500/10 via-background to-orange-500/10 p-8 shadow-sm">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 mb-4 text-sm font-medium text-yellow-600 dark:text-yellow-400">
            <Trophy className="h-4 w-4" /> Hall of Fame
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Global Leaderboard</h1>
          <p className="text-muted-foreground max-w-xl">
            See how you stack up against other developers on LearnPathXX. Stay consistent, learn every day, and build your streak to climb the ranks!
          </p>
        </div>
        <div className="absolute right-0 top-0 -mt-12 -mr-12 opacity-10 blur-3xl pointer-events-none">
          <div className="h-64 w-64 rounded-full bg-yellow-500" />
        </div>
      </header>

      <Card className="border-border/50 shadow-sm overflow-hidden bg-background/50 backdrop-blur-xl">
        <CardContent className="p-0">
          {leaderboard.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No public profiles available yet.</p>
            </div>
          ) : (
            <ul className="divide-y divide-border/50">
              {leaderboard.map((user, index) => {
                const initials = user.name.split(" ").map((n) => n[0]).join("").toUpperCase();
                const rankColor = index === 0 ? "bg-yellow-500/20 text-yellow-600 border-yellow-500/30" : index === 1 ? "bg-slate-300/30 text-slate-500 border-slate-300/30" : index === 2 ? "bg-amber-700/20 text-amber-600 border-amber-700/30" : "bg-muted text-muted-foreground border-transparent";
                const isTop3 = index < 3;
                
                return (
                  <li key={user.id} className={`flex items-center gap-4 p-5 hover:bg-muted/50 transition-colors ${isTop3 ? 'bg-muted/10' : ''}`}>
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-base font-bold shadow-sm ${rankColor}`}>
                      {index + 1}
                    </div>
                    
                    <Avatar className={`h-12 w-12 ${isTop3 ? 'ring-2 ring-offset-2 ring-offset-background ring-primary/20' : ''}`}>
                      <AvatarFallback className="bg-primary/5 text-primary text-lg">{initials}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <Link href={`/u/${user.id}`} className="font-semibold text-base hover:text-primary transition-colors block truncate">
                        {user.name}
                      </Link>
                      {user.githubUsername && (
                        <p className="text-sm text-muted-foreground truncate mt-0.5">@{user.githubUsername}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-6 shrink-0 bg-background/80 px-4 py-2 rounded-xl border border-border/50 shadow-sm">
                      <div className="flex flex-col items-center justify-center min-w-[3rem]" title="Learning Streak">
                        <span className="flex items-center gap-1 text-orange-500 font-bold text-lg">
                          {user.streakCount} <Flame className={`h-4 w-4 ${user.streakCount > 0 ? 'fill-orange-500/20' : ''}`} />
                        </span>
                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Streak</span>
                      </div>
                      <div className="hidden sm:flex flex-col items-center justify-center min-w-[3rem]" title="Topics Completed">
                        <span className="text-base font-semibold">{user._count.topicProgress}</span>
                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Topics</span>
                      </div>
                      <div className="hidden md:flex flex-col items-center justify-center min-w-[3rem]" title="Achievements">
                        <span className="text-base font-semibold">{user._count.achievements}</span>
                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Badges</span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
