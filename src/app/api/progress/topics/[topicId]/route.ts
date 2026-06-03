import { db } from "@/lib/db";
import { getAuthSession, unauthorized, notFound, success } from "@/lib/api-helpers";
import { NextResponse } from "next/server";

// PUT /api/progress/topics/[topicId] - Update topic status
export async function PUT(req: Request, { params }: { params: Promise<{ topicId: string }> }) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { topicId } = await params;
  const { status } = await req.json();

  if (!["NOT_STARTED", "IN_PROGRESS", "COMPLETED"].includes(status)) {
    return NextResponse.json({ message: "Invalid status. Use: NOT_STARTED, IN_PROGRESS, COMPLETED" }, { status: 400 });
  }

  const progress = await db.userTopicProgress.findFirst({
    where: { userId: session.user.id, topicId },
  });
  if (!progress) return notFound("Progress record");

  const updated = await db.userTopicProgress.update({
    where: { id: progress.id },
    data: {
      status,
      completedAt: status === "COMPLETED" ? new Date() : null,
    },
  });

  // Achievement check on completion
  if (status === "COMPLETED") {
    const topic = await db.roadmapTopic.findUnique({
      where: { id: topicId },
      include: { roadmap: true },
    });

    if (topic) {
      await db.activityLog.create({
        data: { userId: session.user.id, activity: `Completed topic: ${topic.title}` },
      });

      const totalTopics = await db.roadmapTopic.count({ where: { roadmapId: topic.roadmapId } });
      const completedTopics = await db.userTopicProgress.count({
        where: { userId: session.user.id, status: "COMPLETED", topic: { roadmapId: topic.roadmapId } },
      });
      const percentage = Math.round((completedTopics / totalTopics) * 100);

      // Check and award achievements
      const achievements = await db.achievement.findMany({
        where: { requirementPercentage: { lte: percentage } },
      });
      const newAchievements: string[] = [];
      for (const ach of achievements) {
        const exists = await db.userAchievement.findFirst({
          where: { userId: session.user.id, achievementId: ach.id },
        });
        if (!exists) {
          await db.userAchievement.create({
            data: { userId: session.user.id, achievementId: ach.id },
          });
          await db.notification.create({
            data: {
              userId: session.user.id,
              title: "Achievement Unlocked! 🏆",
              message: `Congratulations! You earned the "${ach.name}" badge: ${ach.description}`,
            },
          });
          await db.activityLog.create({
            data: { userId: session.user.id, activity: `Earned achievement: ${ach.name}` },
          });
          newAchievements.push(ach.name);
        }
      }

      return success({
        ...updated,
        progressPercentage: percentage,
        newAchievements,
      });
    }
  }

  return success(updated);
}
