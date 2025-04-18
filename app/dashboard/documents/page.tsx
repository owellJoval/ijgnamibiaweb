"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DocumentsTable } from "@/components/documents-table"
import { DocumentUploadDialog } from "@/components/document-upload-dialog"
import { getAllCategories } from "@/lib/api/categories"
import { getAllDocuments, getDocumentsByCategory } from "@/lib/api/documents"

export default function DocumentsPage() {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  })

  const { data: documents = [] } = useQuery({
    queryKey: ["documents", selectedCategory],
    queryFn: () => selectedCategory ? getDocumentsByCategory(selectedCategory) : getAllDocuments(),
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#004c98]">Documents</h1>
        <Button onClick={() => setIsUploadDialogOpen(true)} className="bg-[#004c98] hover:bg-[#003a75]">
          <Plus className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Document Management</CardTitle>
          <CardDescription>View, upload, update, and delete documents</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="all"
            className="w-full"
            onValueChange={(value) => setSelectedCategory(value === "all" ? null : value)}
          >
            <TabsList className="mb-4 flex flex-wrap">
              <TabsTrigger value="all">All Documents</TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="all">
              <DocumentsTable documents={documents} categories={categories} />
            </TabsContent>
            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <DocumentsTable documents={documents} categories={categories} />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <DocumentUploadDialog 
        open={isUploadDialogOpen} 
        onOpenChange={setIsUploadDialogOpen} 
        categories={categories}
      />
    </div>
  )
}
