"use client";

import { useState } from "react";
import { createTopic, deleteTopic, createResource, deleteResource } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Link2 } from "lucide-react";

interface TopicManagerProps {
  roadmapId: string;
  topics: any[];
}

export function TopicManager({ roadmapId, topics }: TopicManagerProps) {
  const [topicOpen, setTopicOpen] = useState(false);
  const [resOpen, setResOpen] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [topicForm, setTopicForm] = useState({ title: "", description: "", orderNumber: (topics.length + 1).toString(), estimatedHours: "" });
  const [resForm, setResForm] = useState({ title: "", url: "", resourceType: "DOCUMENTATION" });

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createTopic({
        roadmapId,
        title: topicForm.title,
        description: topicForm.description,
        orderNumber: parseInt(topicForm.orderNumber),
        estimatedHours: topicForm.estimatedHours ? parseInt(topicForm.estimatedHours) : undefined,
      });
      setTopicOpen(false);
      setTopicForm({ title: "", description: "", orderNumber: (topics.length + 2).toString(), estimatedHours: "" });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateResource = async (e: React.FormEvent, topicId: string) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createResource({
        topicId,
        title: resForm.title,
        url: resForm.url,
        resourceType: resForm.resourceType as any,
      });
      setResOpen(null);
      setResForm({ title: "", url: "", resourceType: "DOCUMENTATION" });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Manage Topics</CardTitle>
        <Dialog open={topicOpen} onOpenChange={setTopicOpen}>
          <DialogTrigger render={
            <Button size="sm"><Plus className="mr-1 h-4 w-4" /> Add Topic</Button>
          } />
          <DialogContent>
            <DialogHeader><DialogTitle>Add Topic</DialogTitle></DialogHeader>
            <form onSubmit={handleCreateTopic} className="space-y-4">
              <div className="space-y-2"><Label>Title</Label><Input value={topicForm.title} onChange={(e) => setTopicForm({ ...topicForm, title: e.target.value })} required /></div>
              <div className="space-y-2"><Label>Description</Label><Textarea value={topicForm.description} onChange={(e) => setTopicForm({ ...topicForm, description: e.target.value })} rows={2} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Order</Label><Input type="number" value={topicForm.orderNumber} onChange={(e) => setTopicForm({ ...topicForm, orderNumber: e.target.value })} /></div>
                <div className="space-y-2"><Label>Est. Hours</Label><Input type="number" value={topicForm.estimatedHours} onChange={(e) => setTopicForm({ ...topicForm, estimatedHours: e.target.value })} /></div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>{loading ? "Adding..." : "Add Topic"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-2">
        {topics.map((topic) => (
          <div key={topic.id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">{topic.orderNumber}</span>
              <div>
                <p className="font-medium">{topic.title}</p>
                <p className="text-xs text-muted-foreground">{topic.resources.length} resources</p>
              </div>
            </div>
            <div className="flex gap-1">
              <Dialog open={resOpen === topic.id} onOpenChange={(v) => setResOpen(v ? topic.id : null)}>
                <DialogTrigger render={
                  <Button variant="ghost" size="sm"><Link2 className="h-4 w-4" /></Button>
                } />
                <DialogContent>
                  <DialogHeader><DialogTitle>Add Resource to "{topic.title}"</DialogTitle></DialogHeader>
                  <form onSubmit={(e) => handleCreateResource(e, topic.id)} className="space-y-4">
                    <div className="space-y-2"><Label>Title</Label><Input value={resForm.title} onChange={(e) => setResForm({ ...resForm, title: e.target.value })} required /></div>
                    <div className="space-y-2"><Label>URL</Label><Input value={resForm.url} onChange={(e) => setResForm({ ...resForm, url: e.target.value })} required /></div>
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select value={resForm.resourceType} onValueChange={(v) => setResForm({ ...resForm, resourceType: v ?? "DOCUMENTATION" })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DOCUMENTATION">Documentation</SelectItem>
                          <SelectItem value="YOUTUBE">YouTube</SelectItem>
                          <SelectItem value="ARTICLE">Article</SelectItem>
                          <SelectItem value="COURSE">Course</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>{loading ? "Adding..." : "Add Resource"}</Button>
                  </form>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger render={<Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-500/10"><Trash2 className="h-4 w-4" /></Button>} />
                <DialogContent>
                  <DialogHeader><DialogTitle className="text-red-500">Delete Topic</DialogTitle></DialogHeader>
                  <p className="text-sm text-muted-foreground">Are you sure you want to delete {topic.title}?</p>
                  <div className="flex justify-end gap-3 mt-4">
                    <DialogClose render={<Button variant="outline">Cancel</Button>} />
                    <DialogClose render={<Button variant="destructive" onClick={() => deleteTopic(topic.id)}>Yes, Delete</Button>} />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
