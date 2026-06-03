"use client";

import { useState } from "react";
import { createWeeklyGoal, completeGoal, deleteGoal } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Check, Trash2 } from "lucide-react";

interface GoalActionsProps {
  mode: "create" | "complete" | "delete";
  goalId?: string;
}

export function GoalActions({ mode, goalId }: GoalActionsProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", deadline: "" });

  if (mode === "complete") {
    return (
      <Button
        variant="ghost" size="sm" className="text-green-400 hover:text-green-300"
        onClick={async () => { setLoading(true); await completeGoal(goalId!); setLoading(false); }}
        disabled={loading}
      >
        <Check className="h-4 w-4" />
      </Button>
    );
  }

  if (mode === "delete") {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={
          <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-500/10" disabled={loading}>
            <Trash2 className="h-4 w-4" />
          </Button>
        } />
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-500">Delete Goal</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete this goal?</p>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="destructive" disabled={loading} onClick={async () => {
              setLoading(true);
              await deleteGoal(goalId!);
              setOpen(false);
            }}>
              {loading ? "Deleting..." : "Yes, Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button size="sm"><Plus className="mr-1 h-4 w-4" /> New Goal</Button>
      } />
      <DialogContent>
        <DialogHeader><DialogTitle>Create Weekly Goal</DialogTitle></DialogHeader>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            try {
              await createWeeklyGoal(form);
              setOpen(false);
              setForm({ title: "", deadline: "" });
            } catch (err: any) {
              alert(err.message);
            } finally {
              setLoading(false);
            }
          }}
          className="space-y-4"
        >
          <div className="space-y-2"><Label>Goal Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="e.g., Complete React Basics" /></div>
          <div className="space-y-2"><Label>Deadline</Label><Input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} required /></div>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Creating..." : "Create Goal"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
