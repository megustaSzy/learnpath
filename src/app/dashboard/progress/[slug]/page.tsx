import { getUserProgress, getRoadmapBySlug } from "@/lib/actions";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Clock } from "lucide-react";
import { TopicStatusButton } from "./topic-status";

export default async function ProgressDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const roadmap = await getRoadmapBySlug(slug);
  if (!roadmap) return notFound();

  let topics;
  try {
    topics = await getUserProgress(roadmap.id);
  } catch {
    return notFound();
  }

  const completed = topics.filter((t) => t.userProgress[0]?.status === "COMPLETED").length;
  const progress = topics.length > 0 ? Math.round((completed / topics.length) * 100) : 0;

  const resourceIcon: Record<string, string> = { DOCUMENTATION: "📖", YOUTUBE: "🎬", ARTICLE: "📝", COURSE: "🎓" };

  return (
    <div className="space-y-6">
      <div>
        <Badge variant="outline" className="mb-2">{roadmap.category.name}</Badge>
        <h1 className="text-2xl font-bold">{roadmap.title}</h1>
        <div className="flex items-center gap-4 mt-3">
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">{completed}/{topics.length} topics</span>
              <span className="font-semibold">{progress}%</span>
            </div>
            <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {topics.map((topic, idx) => {
          const status = topic.userProgress[0]?.status || "NOT_STARTED";
          const statusColor = status === "COMPLETED" ? "bg-green-500" : status === "IN_PROGRESS" ? "bg-amber-500" : "bg-muted-foreground/30";

          return (
            <Card key={topic.id} className={`overflow-hidden transition-all ${status === "COMPLETED" ? "opacity-80" : ""}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    status === "COMPLETED" ? "bg-green-500/20 text-green-400" :
                    status === "IN_PROGRESS" ? "bg-amber-500/20 text-amber-400" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {status === "COMPLETED" ? "✓" : idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{topic.title}</CardTitle>
                      <TopicStatusButton topicId={topic.id} currentStatus={status} />
                    </div>
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
                  <div className="flex flex-wrap gap-2">
                    {topic.resources.map((res) => (
                      <a key={res.id} href={res.url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs hover:bg-accent transition-colors">
                        <span>{resourceIcon[res.resourceType]}</span>
                        {res.title}
                        <ExternalLink className="h-3 w-3 text-muted-foreground" />
                      </a>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
