"use client";

import { useState } from "react";
import { updateUserRole, toggleUserActive, deleteUser } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Ban, Trash2, UserCheck } from "lucide-react";

interface UserActionsProps {
  user: any;
  currentUserId: string;
}

export function UserActions({ user, currentUserId }: UserActionsProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  if (user.id === currentUserId) return <span className="text-xs text-muted-foreground">You</span>;

  return (
    <div className="flex items-center justify-end gap-2">
      <Select
        defaultValue={user.role}
        onValueChange={async (role) => {
          await updateUserRole(user.id, role as any);
        }}
      >
        <SelectTrigger className="w-32 h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="USER">User</SelectItem>
          <SelectItem value="ADMIN">Admin</SelectItem>
          <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
        </SelectContent>
      </Select>

      <Dialog open={open} onOpenChange={setOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <Button variant="ghost" size="sm"><MoreHorizontal className="h-4 w-4" /></Button>
          } />
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => toggleUserActive(user.id)}>
              {user.isActive ? (
                <><Ban className="mr-2 h-4 w-4" /> Disable Account</>
              ) : (
                <><UserCheck className="mr-2 h-4 w-4" /> Enable Account</>
              )}
            </DropdownMenuItem>
            <DialogTrigger render={
              <DropdownMenuItem className="text-red-400">
                <Trash2 className="mr-2 h-4 w-4" /> Delete User
              </DropdownMenuItem>
            } />
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-500">Delete User</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete {user.name}? This action cannot be undone.</p>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="destructive" disabled={loading} onClick={async () => {
              setLoading(true);
              await deleteUser(user.id);
              setOpen(false);
            }}>
              {loading ? "Deleting..." : "Yes, Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
