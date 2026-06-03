"use client";

import { useState } from "react";
import { createCategory, updateCategory, deleteCategory } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface CategoryActionsProps {
  mode: "create" | "edit" | "delete";
  category?: any;
  categoryId?: string;
}

export function CategoryActions({ mode, category, categoryId }: CategoryActionsProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(category?.name || "");

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
            <DialogTitle className="text-red-500">Delete Category</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete this category?</p>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="destructive" disabled={loading} onClick={async () => {
              setLoading(true);
              await deleteCategory(categoryId!);
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
        mode === "create" ? (
          <Button size="sm"><Plus className="mr-1 h-4 w-4" /> New Category</Button>
        ) : (
          <Button variant="ghost" size="sm"><Pencil className="h-4 w-4" /></Button>
        )
      } />
      <DialogContent>
        <DialogHeader><DialogTitle>{mode === "create" ? "Create Category" : "Edit Category"}</DialogTitle></DialogHeader>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            try {
              if (mode === "edit") {
                await updateCategory(category.id, { name });
              } else {
                await createCategory({ name });
              }
              setOpen(false);
              setName("");
            } catch (err: any) {
              alert(err.message);
            } finally {
              setLoading(false);
            }
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label>Category Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g., Backend Development" />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : mode === "create" ? "Create" : "Update"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
