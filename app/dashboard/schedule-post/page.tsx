"use client"

import { useQuery } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SchedulePostForm } from "@/components/schedule-post-form"
import { ScheduledPostsTable } from "@/components/scheduled-posts-table"
import { getAllScheduledPosts } from "@/lib/api/scheduled-posts"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"

export default function SchedulePostPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { data: posts = [] } = useQuery({
    queryKey: ["scheduled-posts"],
    queryFn: getAllScheduledPosts,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#004c98]">Schedule Posts</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#004c98] hover:bg-[#003a75]">
              <Plus className="mr-2 h-4 w-4" />
              Schedule New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Schedule New Post</DialogTitle>
              <DialogDescription>
                Create a new post and schedule it for future publication.
              </DialogDescription>
            </DialogHeader>
            <SchedulePostForm onSuccess={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Scheduled Posts</CardTitle>
          <CardDescription>
            View and manage your scheduled posts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScheduledPostsTable posts={posts} />
        </CardContent>
      </Card>
    </div>
  )
} 