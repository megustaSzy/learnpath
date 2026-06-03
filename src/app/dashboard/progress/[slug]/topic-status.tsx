"use client";

import { useState } from "react";
import { updateTopicStatus } from "@/lib/actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function TopicStatusButton({ topicId, currentStatus }: { topicId: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleChange = async (newStatus: string | null) => {
    if (!newStatus) return;
    setLoading(true);
    try {
      await updateTopicStatus(topicId, newStatus as any);
      setStatus(newStatus);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const statusColor = status === "COMPLETED" ? "text-green-400" : status === "IN_PROGRESS" ? "text-amber-400" : "text-muted-foreground";

  return (
    <Select value={status} onValueChange={handleChange} disabled={loading}>
      <SelectTrigger className={`w-36 text-xs h-8 ${statusColor}`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="NOT_STARTED">Not Started</SelectItem>
        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
        <SelectItem value="COMPLETED">Completed</SelectItem>
      </SelectContent>
    </Select>
  );
}
