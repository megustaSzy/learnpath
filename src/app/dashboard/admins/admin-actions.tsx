"use client";

import { useState } from "react";
import { createAdmin, deleteUser } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2 } from "lucide-react";

interface AdminActionsProps {
  mode: "create" | "delete";
  adminId?: string;
  adminName?: string;
}

export function AdminActions({ mode, adminId, adminName }: AdminActionsProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

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
            <DialogTitle className="text-red-500">Remove Admin</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to remove {adminName}?</p>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="destructive" disabled={loading} onClick={async () => {
              setLoading(true);
              await deleteUser(adminId!);
              setOpen(false);
            }}>
              {loading ? "Removing..." : "Yes, Remove"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button size="sm"><Plus className="mr-1 h-4 w-4" /> Create Admin</Button>
      } />
      <DialogContent>
        <DialogHeader><DialogTitle>Create New Admin</DialogTitle></DialogHeader>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            try {
              await createAdmin(form);
              setOpen(false);
              setForm({ name: "", email: "", password: "" });
            } catch (err: any) {
              alert(err.message);
            } finally {
              setLoading(false);
            }
          }}
          className="space-y-4"
        >
          <div className="space-y-2"><Label>Full Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
          <div className="space-y-2"><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
          <div className="space-y-2"><Label>Password</Label><Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={8} /></div>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Creating..." : "Create Admin"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
