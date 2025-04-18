"use client"

import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { Calendar } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { createScheduledPost, updateScheduledPost } from "@/lib/api/scheduled-posts"
import type { ScheduledPost } from "@/types/scheduled-post"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const formSchema = z.object({
  type: z.enum(['news', 'document'], {
    required_error: "Please select the content type",
  }),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  content: z.string().min(1, "Content is required"),
  scheduledDate: z.date({
    required_error: "Please select a date",
  }),
  category: z.string().optional(),
  file: z.any().optional(), // For document uploads
  image: z.any().optional(),
});

interface SchedulePostFormProps {
  post?: ScheduledPost;
  onSuccess?: () => void;
}

export function SchedulePostForm({ post, onSuccess }: SchedulePostFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: post?.type || 'news',
      title: post?.title || "",
      description: post?.description || "",
      content: post?.content || "",
      scheduledDate: post?.scheduledDate ? new Date(post.scheduledDate) : new Date(),
      category: post?.category || "",
    },
  });

  const contentType = form.watch('type');

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key === 'scheduledDate') {
          formData.append(key, value.toISOString());
        } else if (key === 'file' && value instanceof FileList) {
          formData.append(key, value[0]);
        } else if (value !== undefined) {
          formData.append(key, value);
        }
      });

      if (post?.id) {
        await updateScheduledPost(post.id, formData);
        toast({
          title: "Post updated",
          description: "Your scheduled post has been updated successfully.",
        });
      } else {
        await createScheduledPost(formData);
    toast({
      title: "Post scheduled",
          description: "Your post has been scheduled successfully.",
        });
      }

      queryClient.invalidateQueries({ queryKey: ["scheduled-posts"] });
      onSuccess?.();
      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to schedule post. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
          <SelectTrigger>
                    <SelectValue placeholder="Select content type" />
          </SelectTrigger>
                </FormControl>
          <SelectContent>
                  <SelectItem value="news">News</SelectItem>
            <SelectItem value="document">Document</SelectItem>
          </SelectContent>
        </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter description"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {contentType === 'news' && (
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter news content"
                    className="min-h-[200px] resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {contentType === 'document' && (
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Document File</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    onChange={(e) => field.onChange(e.target.files)}
                    accept=".pdf,.doc,.docx,.txt"
                  />
                </FormControl>
                <FormDescription>
                  Upload your document file (PDF, DOC, DOCX, or TXT)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="scheduledDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Schedule Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <Calendar className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Select the date when you want this content to be published.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Scheduling..." : post ? "Update Schedule" : "Schedule Post"}
      </Button>
    </form>
    </Form>
  );
}
