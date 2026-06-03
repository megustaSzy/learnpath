import { getNotifications } from "@/lib/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { NotificationActions } from "./notification-actions";

export default async function NotificationsPage() {
  const notifications = await getNotifications();
  const unread = notifications.filter((n) => !n.isRead);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">{unread.length} unread notifications</p>
        </div>
        {unread.length > 0 && <NotificationActions mode="markAll" />}
      </div>

      {notifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Bell className="h-16 w-16 text-muted-foreground/30" />
            <p className="mt-4 text-lg text-muted-foreground">No notifications</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {notifications.map((notif) => (
            <Card key={notif.id} className={`transition-all ${!notif.isRead ? "ring-1 ring-primary/30 bg-primary/5" : "opacity-70"}`}>
              <CardContent className="p-4 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  {!notif.isRead && <div className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />}
                  <div>
                    <p className="font-medium text-sm">{notif.title}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{notif.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(notif.createdAt).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                      })}
                    </p>
                  </div>
                </div>
                {!notif.isRead && <NotificationActions mode="markOne" notificationId={notif.id} />}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
