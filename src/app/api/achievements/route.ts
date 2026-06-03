import { db } from "@/lib/db";
import { getAuthSession, unauthorized, success } from "@/lib/api-helpers";

// GET /api/achievements - Get all achievements with user earned status
export async function GET() {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const achievements = await db.achievement.findMany({
    orderBy: { requirementPercentage: "asc" },
    include: {
      userAchievements: { where: { userId: session.user.id } },
    },
  });

  const data = achievements.map((ach) => ({
    id: ach.id,
    name: ach.name,
    description: ach.description,
    badgeIcon: ach.badgeIcon,
    requirementPercentage: ach.requirementPercentage,
    isEarned: ach.userAchievements.length > 0,
    earnedAt: ach.userAchievements[0]?.earnedAt || null,
  }));

  return success(data);
}
