import { db } from "@/lib/db";
import { getAuthSession, unauthorized, notFound, success } from "@/lib/api-helpers";
import { NextResponse } from "next/server";

// GET /api/progress - Get all user's roadmap progress
export async function GET() {
  const session = await getAuthSession();
  if (!session) return unauthorized();

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
        roadmapId: ur.roadmapId,
        roadmapTitle: ur.roadmap.title,
        category: ur.roadmap.category.name,
        difficulty: ur.roadmap.difficulty,
        joinedAt: ur.joinedAt,
        completedTopics: completed,
        inProgressTopics: inProgress,
        totalTopics: total,
        progressPercentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      };
    })
  );

  return success(progressData);
}

// POST /api/progress - Join a roadmap
export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  try {
    const { roadmapId } = await req.json();
    if (!roadmapId) return NextResponse.json({ message: "roadmapId is required" }, { status: 400 });

    const roadmap = await db.roadmap.findUnique({ where: { id: roadmapId } });
    if (!roadmap) return notFound("Roadmap");

    const existing = await db.userRoadmap.findFirst({
      where: { userId: session.user.id, roadmapId },
    });
    if (existing) return NextResponse.json({ message: "Already joined this roadmap" }, { status: 409 });

    const ur = await db.userRoadmap.create({
      data: { userId: session.user.id, roadmapId },
    });

    // Create progress entries for all topics
    const topics = await db.roadmapTopic.findMany({ where: { roadmapId } });
    for (const topic of topics) {
      await db.userTopicProgress.create({
        data: { userId: session.user.id, topicId: topic.id },
      });
    }

    await db.activityLog.create({
      data: { userId: session.user.id, activity: `Joined roadmap: ${roadmap.title}` },
    });

    return success(ur, 201);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
