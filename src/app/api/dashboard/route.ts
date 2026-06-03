import { db } from "@/lib/db";
import { getAuthSession, unauthorized, forbidden, success, isAdmin, isSuperAdmin } from "@/lib/api-helpers";

// GET /api/dashboard - Get dashboard statistics based on role
export async function GET() {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const userId = session.user.id;
  const role = session.user.role;

  // === USER DASHBOARD ===
  if (role === "USER") {
    const [roadmapsJoined, topicsCompleted, totalGoals, completedGoals, achievementCount, recentActivity] = await Promise.all([
      db.userRoadmap.count({ where: { userId } }),
      db.userTopicProgress.count({ where: { userId, status: "COMPLETED" } }),
      db.weeklyGoal.count({ where: { userId } }),
      db.weeklyGoal.count({ where: { userId, status: "COMPLETED" } }),
      db.userAchievement.count({ where: { userId } }),
      db.activityLog.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 10 }),
    ]);

    const userRoadmaps = await db.userRoadmap.findMany({
      where: { userId },
      include: {
        roadmap: { include: { category: true, _count: { select: { topics: true } } } },
      },
    });

    const roadmapProgress = await Promise.all(
      userRoadmaps.map(async (ur) => {
        const completed = await db.userTopicProgress.count({
          where: { userId, status: "COMPLETED", topic: { roadmapId: ur.roadmapId } },
        });
        const total = ur.roadmap._count.topics;
        return {
          id: ur.roadmap.id,
          title: ur.roadmap.title,
          category: ur.roadmap.category.name,
          progress: total > 0 ? Math.round((completed / total) * 100) : 0,
          completedTopics: completed,
          totalTopics: total,
        };
      })
    );

    return success({
      role: "USER",
      stats: { roadmapsJoined, topicsCompleted, totalGoals, completedGoals, achievementCount },
      recentActivity,
      roadmapProgress,
    });
  }

  // === ADMIN DASHBOARD ===
  if (role === "ADMIN") {
    const [totalUsers, totalRoadmaps, totalTopics] = await Promise.all([
      db.user.count({ where: { role: "USER" } }),
      db.roadmap.count(),
      db.roadmapTopic.count(),
    ]);

    const popularRoadmaps = await db.roadmap.findMany({
      include: { _count: { select: { userRoadmaps: true } }, category: true },
      orderBy: { userRoadmaps: { _count: "desc" } },
      take: 5,
    });

    return success({
      role: "ADMIN",
      stats: { totalUsers, totalRoadmaps, totalTopics },
      popularRoadmaps,
    });
  }

  // === SUPER ADMIN DASHBOARD ===
  if (isSuperAdmin(role)) {
    const [totalUsers, totalAdmins, totalRoadmaps, activeUsers] = await Promise.all([
      db.user.count(),
      db.user.count({ where: { role: "ADMIN" } }),
      db.roadmap.count(),
      db.user.count({ where: { isActive: true } }),
    ]);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newRegistrations = await db.user.count({
      where: { createdAt: { gte: thirtyDaysAgo } },
    });

    return success({
      role: "SUPER_ADMIN",
      stats: { totalUsers, totalAdmins, totalRoadmaps, activeUsers, newRegistrations },
    });
  }

  return forbidden();
}
