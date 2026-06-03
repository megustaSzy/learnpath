import { db } from "@/lib/db";
import { getAuthSession, unauthorized, success } from "@/lib/api-helpers";

// GET /api/activity - Get user activity logs
export async function GET() {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const logs = await db.activityLog.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return success(logs);
}
