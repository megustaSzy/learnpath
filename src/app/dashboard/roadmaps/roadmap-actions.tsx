"use client";

import { useState } from "react";
import { createRoadmap, updateRoadmap, deleteRoadmap, getCategories } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useEffect } from "react";

interface RoadmapActionsProps {
  mode: "create" | "edit" | "delete";
  roadmap?: any;
  roadmapId?: string;
}

export function RoadmapActions({ mode, roadmap, roadmapId }: RoadmapActionsProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingCats, setLoadingCats] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: roadmap?.title || "",
    description: roadmap?.description || "",
    categoryId: roadmap?.categoryId || "",
    difficulty: roadmap?.difficulty || "BEGINNER",
    estimatedHours: roadmap?.estimatedHours?.toString() || "",
  });

  useEffect(() => {
    if (mode !== "delete") {
      setLoadingCats(true);
      getCategories().then((data) => {
        setCategories(data);
        setLoadingCats(false);
      });
    }
  }, [mode]);

  if (mode === "delete") {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={
          <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
            <Trash2 className="h-4 w-4" />
          </Button>
        } />
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-500">Delete Roadmap</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete this roadmap? This action cannot be undone.</p>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="destructive" disabled={loading} onClick={async () => {
              setLoading(true);
              await deleteRoadmap(roadmapId!);
              setOpen(false);
            }}>
              {loading ? "Deleting..." : "Yes, Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        title: form.title,
        description: form.description,
        categoryId: form.categoryId,
        difficulty: form.difficulty as "BEGINNER" | "INTERMEDIATE" | "ADVANCED",
        estimatedHours: form.estimatedHours ? parseInt(form.estimatedHours) : undefined,
      };
      if (mode === "edit" && roadmap) {
        await updateRoadmap(roadmap.id, data);
      } else {
        await createRoadmap(data);
      }
      setOpen(false);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={mode === "create" ? (
          <Button size="sm"><Plus className="mr-2 h-4 w-4" /> New Roadmap</Button>
        ) : (
          <Button variant="ghost" size="sm"><Pencil className="h-4 w-4" /></Button>
        )}
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create Roadmap" : "Edit Roadmap"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              {loadingCats ? (
                <div className="h-9 w-full animate-pulse rounded-md border border-input bg-muted/30" />
              ) : (
                <Select value={form.categoryId} onValueChange={(v) => setForm({ ...form, categoryId: v })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category">
                      {form.categoryId ? categories.find(cat => cat.id === form.categoryId)?.name : "Select category"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="space-y-2">
              <Label>Difficulty</Label>
              <Select value={form.difficulty} onValueChange={(v) => setForm({ ...form, difficulty: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="BEGINNER">Beginner</SelectItem>
                  <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                  <SelectItem value="ADVANCED">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Estimated Hours</Label>
            <Input type="number" value={form.estimatedHours} onChange={(e) => setForm({ ...form, estimatedHours: e.target.value })} />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : mode === "create" ? "Create Roadmap" : "Update Roadmap"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
