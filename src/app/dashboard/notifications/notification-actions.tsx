"use client";

import { markNotificationRead, markAllNotificationsRead } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Check, CheckCheck } from "lucide-react";

export function NotificationActions({ mode, notificationId }: { mode: "markOne" | "markAll"; notificationId?: string }) {
  if (mode === "markAll") {
    return (
      <Button variant="outline" size="sm" onClick={() => markAllNotificationsRead()}>
        <CheckCheck className="mr-1 h-4 w-4" /> Mark All Read
      </Button>
    );
  }

  return (
    <Button variant="ghost" size="sm" onClick={() => markNotificationRead(notificationId!)} className="shrink-0">
      <Check className="h-4 w-4" />
    </Button>
  );
}
