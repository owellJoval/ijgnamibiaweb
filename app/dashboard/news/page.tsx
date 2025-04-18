"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { NewsTable } from "@/components/news-table"
import { NewsDialog } from "@/components/news-dialog"
import { getAllNews } from "@/lib/api/news"

export default function NewsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { data: news = [] } = useQuery({
    queryKey: ["news"],
    queryFn: getAllNews,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#004c98]">News</h1>
        <Button onClick={() => setIsDialogOpen(true)} className="bg-[#004c98] hover:bg-[#003a75]">
          <Plus className="mr-2 h-4 w-4" />
          Create News
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>News Management</CardTitle>
          <CardDescription>Create, view, update, and delete news articles</CardDescription>
        </CardHeader>
        <CardContent>
          <NewsTable news={news} />
        </CardContent>
      </Card>

      <NewsDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  )
}
