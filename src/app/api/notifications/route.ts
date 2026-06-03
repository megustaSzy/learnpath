import { db } from "@/lib/db";
import { getAuthSession, unauthorized, success } from "@/lib/api-helpers";

// GET /api/notifications - Get user notifications
export async function GET() {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const notifications = await db.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return success(notifications);
}
