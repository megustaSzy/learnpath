"use client";

import { useState } from "react";
import { updateTopicStatus } from "@/lib/actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function TopicStatusButton({ topicId, currentStatus }: { topicId: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [githubUrl, setGithubUrl] = useState("");

  const handleChange = async (newStatus: string | null) => {
    if (!newStatus) return;
    
    if (newStatus === "COMPLETED") {
      setDialogOpen(true);
      return;
    }

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

  const submitCompleted = async () => {
    setLoading(true);
    try {
      await updateTopicStatus(topicId, "COMPLETED", githubUrl);
      setStatus("COMPLETED");
      setDialogOpen(false);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const statusColor = status === "COMPLETED" ? "text-green-400" : status === "IN_PROGRESS" ? "text-amber-400" : "text-muted-foreground";

  return (
    <>
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

      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background border rounded-lg p-6 w-full max-w-md shadow-lg">
            <h3 className="text-lg font-bold mb-2">Topic Completed! 🎉</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Do you have a GitHub repository for this topic? Attach it to show on your public portfolio.
            </p>
            <input 
              type="url" 
              placeholder="https://github.com/username/repo" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mb-4"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setDialogOpen(false)}
                className="px-4 py-2 text-sm rounded-md border hover:bg-accent"
              >
                Cancel
              </button>
              <button 
                onClick={submitCompleted}
                disabled={loading}
                className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {loading ? "Saving..." : "Mark Completed"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
