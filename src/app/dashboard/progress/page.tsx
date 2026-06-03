import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Map } from "lucide-react";

export default async function ProgressPage() {
  const session = await auth();
  if (!session?.user) return null;

  const userRoadmaps = await db.userRoadmap.findMany({
    where: { userId: session.user.id },
    include: {
      roadmap: {
        include: {
          category: true,
          _count: { select: { topics: true } },
        },
      },
    },
    orderBy: { joinedAt: "desc" },
  });

  const progressData = await Promise.all(
    userRoadmaps.map(async (ur) => {
      const completed = await db.userTopicProgress.count({
        where: { userId: session.user.id, status: "COMPLETED", topic: { roadmapId: ur.roadmapId } },
      });
      const inProgress = await db.userTopicProgress.count({
        where: { userId: session.user.id, status: "IN_PROGRESS", topic: { roadmapId: ur.roadmapId } },
      });
      const total = ur.roadmap._count.topics;
      return {
        ...ur,
        completed,
        inProgress,
        total,
        progress: total > 0 ? Math.round((completed / total) * 100) : 0,
      };
    })
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Progress</h1>
        <p className="text-muted-foreground">Track your learning journey across all roadmaps</p>
      </div>

      {progressData.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Map className="h-16 w-16 text-muted-foreground/30" />
            <p className="mt-4 text-lg font-medium text-muted-foreground">No roadmaps joined yet</p>
            <Link href="/dashboard/roadmaps" className="mt-2 text-primary hover:underline text-sm">
              Browse Roadmaps →
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {progressData.map((item) => (
            <Link key={item.id} href={`/dashboard/progress/${item.roadmap.slug}`}>
              <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{item.roadmap.category.name}</Badge>
                    <Badge variant="secondary" className="text-xs">{item.roadmap.difficulty}</Badge>
                  </div>
                  <CardTitle className="text-lg mt-2">{item.roadmap.title}</CardTitle>
                  <CardDescription>Joined {new Date(item.joinedAt).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{item.completed}/{item.total} topics completed</span>
                      <span className="font-semibold">{item.progress}%</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${item.progress}%` }} />
                    </div>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-green-500" /> {item.completed} completed</span>
                      <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" /> {item.inProgress} in progress</span>
                      <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-muted-foreground/30" /> {item.total - item.completed - item.inProgress} not started</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
