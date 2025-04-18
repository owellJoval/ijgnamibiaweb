"use client"

import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getAllDocuments } from "@/lib/api/documents"

export function RecentDocuments() {
  const { data: documents = [], isLoading } = useQuery({
    queryKey: ["documents"],
    queryFn: getAllDocuments,
  })

  const recentDocuments = documents.slice(0, 5)

  if (isLoading) {
    return <div className="text-center py-4">Loading recent documents...</div>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentDocuments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center">
                No documents found.
              </TableCell>
            </TableRow>
          ) : (
            recentDocuments.map((document) => (
              <TableRow key={document.id}>
                <TableCell className="font-medium">{document.title}</TableCell>
                <TableCell>{document.category.name}</TableCell>
                <TableCell>{format(new Date(document.datePosted), "MMM d, yyyy")}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
