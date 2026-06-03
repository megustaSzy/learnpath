import { db } from "@/lib/db";
import { getAuthSession, unauthorized, notFound, success } from "@/lib/api-helpers";

// PUT /api/notifications/[id] - Mark single notification as read
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { id } = await params;

  // "mark-all" is a special id to mark all notifications as read
  if (id === "mark-all") {
    await db.notification.updateMany({
      where: { userId: session.user.id, isRead: false },
      data: { isRead: true },
    });
    return success({ message: "All notifications marked as read" });
  }

  const notification = await db.notification.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!notification) return notFound("Notification");

  await db.notification.update({ where: { id }, data: { isRead: true } });
  return success({ message: "Notification marked as read" });
}
