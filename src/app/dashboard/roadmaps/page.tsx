import { getRoadmaps } from "@/lib/actions";
import { auth } from "@/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Map, Clock, Users, BookOpen } from "lucide-react";
import Link from "next/link";
import { RoadmapActions } from "./roadmap-actions";

export default async function RoadmapsPage() {
  const session = await auth();
  const roadmaps = await getRoadmaps();
  const role = (session?.user as any)?.role;
  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";

  const difficultyColor: Record<string, string> = {
    BEGINNER: "bg-green-500/10 text-green-400 border-green-500/20",
    INTERMEDIATE: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    ADVANCED: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Roadmaps</h1>
          <p className="text-muted-foreground">Browse and join learning roadmaps</p>
        </div>
        {isAdmin && <RoadmapActions mode="create" />}
      </div>

      {roadmaps.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Map className="h-16 w-16 text-muted-foreground/30" />
            <p className="mt-4 text-lg font-medium text-muted-foreground">No roadmaps yet</p>
            {isAdmin && <p className="text-sm text-muted-foreground">Create your first roadmap to get started.</p>}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roadmaps.map((roadmap) => (
            <Card key={roadmap.id} className="group relative overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <Badge variant="outline" className="text-xs">{roadmap.category.name}</Badge>
                  <Badge className={`text-xs border ${difficultyColor[roadmap.difficulty]}`}>
                    {roadmap.difficulty}
                  </Badge>
                </div>
                <CardTitle className="mt-2 text-lg leading-tight">
                  <Link href={`/dashboard/roadmaps/${roadmap.slug}`} className="hover:text-primary transition-colors">
                    {roadmap.title}
                  </Link>
                </CardTitle>
                <CardDescription className="line-clamp-2">{roadmap.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3.5 w-3.5" />
                    {roadmap._count.topics} topics
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {roadmap._count.userRoadmaps} learners
                  </span>
                  {roadmap.estimatedHours && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {roadmap.estimatedHours}h
                    </span>
                  )}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">By {roadmap.creator.name}</p>
                {isAdmin && (
                  <div className="mt-3 flex gap-2">
                    <RoadmapActions mode="edit" roadmap={roadmap} />
                    <RoadmapActions mode="delete" roadmapId={roadmap.id} />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
