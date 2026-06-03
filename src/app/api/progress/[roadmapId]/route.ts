import { db } from "@/lib/db";
import { getAuthSession, unauthorized, notFound, success } from "@/lib/api-helpers";
import { NextResponse } from "next/server";

// GET /api/progress/[roadmapId] - Get detailed topic progress for a roadmap
export async function GET(req: Request, { params }: { params: Promise<{ roadmapId: string }> }) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { roadmapId } = await params;
  const roadmap = await db.roadmap.findUnique({
    where: { id: roadmapId },
    include: { category: true },
  });
  if (!roadmap) return notFound("Roadmap");

  const topics = await db.roadmapTopic.findMany({
    where: { roadmapId },
    orderBy: { orderNumber: "asc" },
    include: {
      resources: true,
      userProgress: { where: { userId: session.user.id } },
    },
  });

  const completed = topics.filter((t) => t.userProgress[0]?.status === "COMPLETED").length;

  return success({
    roadmap: {
      id: roadmap.id,
      title: roadmap.title,
      category: roadmap.category.name,
    },
    totalTopics: topics.length,
    completedTopics: completed,
    progressPercentage: topics.length > 0 ? Math.round((completed / topics.length) * 100) : 0,
    topics: topics.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      orderNumber: t.orderNumber,
      estimatedHours: t.estimatedHours,
      status: t.userProgress[0]?.status || "NOT_STARTED",
      completedAt: t.userProgress[0]?.completedAt || null,
      resources: t.resources,
    })),
  });
}
