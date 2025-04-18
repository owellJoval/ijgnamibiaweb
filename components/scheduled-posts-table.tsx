"use client"

import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { MoreHorizontal, Pencil, Trash, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { deleteScheduledPost } from "@/lib/api/scheduled-posts"
import type { ScheduledPost } from "@/types/scheduled-post"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { SchedulePostForm } from "./schedule-post-form"

interface ScheduledPostsTableProps {
  posts: ScheduledPost[]
}

export function ScheduledPostsTable({ posts }: ScheduledPostsTableProps) {
  const [editingPost, setEditingPost] = useState<ScheduledPost | null>(null)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const handleDelete = async (post: ScheduledPost) => {
    try {
      await deleteScheduledPost(post.id)
      queryClient.invalidateQueries({ queryKey: ["scheduled-posts"] })
      toast({
        title: "Post deleted",
        description: "The scheduled post has been deleted successfully.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete post. Please try again.",
      })
    }
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Scheduled Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">{post.title}</TableCell>
                <TableCell>{post.description}</TableCell>
                <TableCell>{format(new Date(post.scheduledDate), "PPP")}</TableCell>
                <TableCell>
                  <Badge variant={post.status === "published" ? "default" : "secondary"}>
                    {post.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => setEditingPost(post)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(post)}
                        className="text-red-600"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editingPost} onOpenChange={(open) => !open && setEditingPost(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Scheduled Post</DialogTitle>
            <DialogDescription>
              Make changes to your scheduled post here.
            </DialogDescription>
          </DialogHeader>
          {editingPost && (
            <SchedulePostForm
              post={editingPost}
              onSuccess={() => setEditingPost(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
} 