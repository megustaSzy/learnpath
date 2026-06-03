import { getRoadmapBySlug } from "@/lib/actions";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen, Users, ExternalLink } from "lucide-react";
import { JoinRoadmapButton } from "./join-button";
import { TopicManager } from "./topic-manager";

export default async function RoadmapDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const roadmap = await getRoadmapBySlug(slug);
  if (!roadmap) return notFound();

  const session = await auth();
  const role = (session?.user as any)?.role;
  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";

  const difficultyColor: Record<string, string> = {
    BEGINNER: "bg-green-500/10 text-green-400 border-green-500/20",
    INTERMEDIATE: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    ADVANCED: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  const resourceIcon: Record<string, string> = {
    DOCUMENTATION: "📖",
    YOUTUBE: "🎬",
    ARTICLE: "📝",
    COURSE: "🎓",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline">{roadmap.category.name}</Badge>
            <Badge className={`border ${difficultyColor[roadmap.difficulty]}`}>{roadmap.difficulty}</Badge>
          </div>
          <h1 className="text-2xl font-bold">{roadmap.title}</h1>
          <p className="mt-1 text-muted-foreground">{roadmap.description}</p>
          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><BookOpen className="h-4 w-4" />{roadmap.topics.length} topics</span>
            <span className="flex items-center gap-1"><Users className="h-4 w-4" />{roadmap._count.userRoadmaps} learners</span>
            {roadmap.estimatedHours && <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{roadmap.estimatedHours}h</span>}
          </div>
        </div>
        {role === "USER" && <JoinRoadmapButton roadmapId={roadmap.id} roadmapSlug={roadmap.slug} />}
      </div>

      {/* Admin: Topic Manager */}
      {isAdmin && <TopicManager roadmapId={roadmap.id} topics={roadmap.topics} />}

      {/* Topics List */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Learning Path</h2>
        {roadmap.topics.map((topic, idx) => (
          <Card key={topic.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-base">{topic.title}</CardTitle>
                  {topic.description && <CardDescription className="mt-1">{topic.description}</CardDescription>}
                  {topic.estimatedHours && (
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {topic.estimatedHours} hours
                    </p>
                  )}
                </div>
              </div>
            </CardHeader>
            {topic.resources.length > 0 && (
              <CardContent className="pt-0 pl-14">
                <p className="text-xs font-medium text-muted-foreground mb-2">Resources:</p>
                <div className="flex flex-wrap gap-2">
                  {topic.resources.map((res) => (
                    <a
                      key={res.id}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs hover:bg-accent transition-colors"
                    >
                      <span>{resourceIcon[res.resourceType]}</span>
                      {res.title}
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </a>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
