import { getLeaderboard } from "@/lib/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Flame, Map as MapIcon } from "lucide-react";
import Link from "next/link";

export default async function LeaderboardPage() {
  const leaderboard = await getLeaderboard();

  return (
    <main className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Global Leaderboard</h1>
        <p className="text-muted-foreground">See how you stack up against other developers on LearnPath.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Trophy className="h-5 w-5 text-yellow-500" /> Top Learners</CardTitle>
        </CardHeader>
        <CardContent>
          {leaderboard.length === 0 ? (
            <p className="text-sm text-muted-foreground">No public profiles available yet.</p>
          ) : (
            <ul className="space-y-3 list-none p-0 m-0">
              {leaderboard.map((user, index) => {
                const initials = user.name.split(" ").map((n) => n[0]).join("").toUpperCase();
                const rankColor = index === 0 ? "bg-yellow-500/20 text-yellow-600" : index === 1 ? "bg-slate-300/30 text-slate-400" : index === 2 ? "bg-amber-700/20 text-amber-600" : "bg-muted text-muted-foreground";
                
                return (
                  <li key={user.id} className="flex items-center gap-4 p-4 rounded-lg border hover:bg-accent/50 transition-colors">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${rankColor}`}>
                      {index + 1}
                    </div>
                    
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary">{initials}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <Link href={`/u/${user.id}`} className="font-medium hover:underline block truncate">
                        {user.name}
                      </Link>
                      {user.githubUsername && (
                        <p className="text-xs text-muted-foreground truncate">@{user.githubUsername}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-6 shrink-0 text-sm">
                      <div className="flex items-center gap-1.5 text-orange-500 font-medium" title="Learning Streak">
                        <Flame className="h-4 w-4" /> {user.streakCount}
                      </div>
                      <div className="hidden sm:flex items-center gap-1.5 text-muted-foreground" title="Topics Completed">
                        <MapIcon className="h-4 w-4" /> {user._count.topicProgress}
                      </div>
                      <div className="hidden sm:flex items-center gap-1.5 text-muted-foreground" title="Achievements">
                        <Trophy className="h-4 w-4" /> {user._count.achievements}
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
