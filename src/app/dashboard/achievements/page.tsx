import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";

export default async function AchievementsPage() {
  const session = await auth();
  if (!session?.user) return null;

  const allAchievements = await db.achievement.findMany({
    orderBy: { requirementPercentage: "asc" },
    include: {
      userAchievements: { where: { userId: session.user.id } },
    },
  });

  const earned = allAchievements.filter((a) => a.userAchievements.length > 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Achievements</h1>
        <p className="text-muted-foreground">
          Earn badges by completing roadmap milestones · {earned.length}/{allAchievements.length} unlocked
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {allAchievements.map((ach) => {
          const isEarned = ach.userAchievements.length > 0;
          const earnedAt = isEarned ? ach.userAchievements[0].earnedAt : null;

          return (
            <Card key={ach.id} className={`relative overflow-hidden transition-all ${isEarned ? "ring-1 ring-primary/50" : "opacity-50 grayscale"}`}>
              {isEarned && (
                <div className="absolute top-0 right-0 p-2">
                  <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                </div>
              )}
              <CardContent className="p-6 text-center">
                <div className="text-5xl mb-3">{ach.badgeIcon}</div>
                <h3 className="text-lg font-bold">{ach.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{ach.description}</p>
                <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {ach.requirementPercentage}% progress required
                </div>
                {earnedAt && (
                  <p className="mt-2 text-xs text-green-400">
                    Earned on {new Date(earnedAt).toLocaleDateString()}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {allAchievements.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Trophy className="h-16 w-16 text-muted-foreground/30" />
            <p className="mt-4 text-lg text-muted-foreground">No achievements available yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
