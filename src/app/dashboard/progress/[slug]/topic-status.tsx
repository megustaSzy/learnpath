"use client";

import { useState } from "react";
import { updateTopicStatus } from "@/lib/actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Topic Completed! 🎉</DialogTitle>
            <DialogDescription>
              Do you have a GitHub repository for this topic? Attach it to show on your public portfolio.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input 
              type="url" 
              placeholder="https://github.com/username/repo" 
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
            />
          </div>
          <DialogFooter className="flex sm:justify-end gap-3">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Skip
            </Button>
            <Button onClick={submitCompleted} disabled={loading}>
              {loading ? "Saving..." : "Mark Completed"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
