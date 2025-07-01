// components/upload-note-form.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, UploadCloud, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";
import branches from "@/lib/branchs";

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters",
  }),
  branch: z.enum(["cse", "ece", "mech", "civil", "eee"], {
    required_error: "Please select branch",
  }),
  semester: z.enum(["1", "2", "3", "4", "5", "6", "7", "8"], {
    required_error: "Please select semester",
  }),
  subject: z.string({
    required_error: "Please select a subject",
  }),
  file: z
    .custom<File>((v) => v instanceof File, {
      message: "Please upload a valid file",
    })
    .refine(
      (file) =>
        [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(file.type),
      "Only PDF and Word documents are allowed"
    ),
});

type FormValues = z.infer<typeof formSchema>;

export default function UploadNoteForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [filePreview, setFilePreview] = useState<{
    name: string;
    type: string;
    size: number;
  } | null>(null);
  const [subjects, setSubjects] = useState<
    { id: string; name: string; code: string }[]
  >([]);
  const [isFetchingSubjects, setIsFetchingSubjects] = useState(false);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      branch: undefined,
      semester: undefined,
      subject: "",
    },
  });

  // Watch branch and semester changes
  const branch = form.watch("branch");
  const semester = form.watch("semester");

  // Fetch subjects when branch or semester changes
  useEffect(() => {
    const fetchSubjects = async () => {
      if (branch && semester) {
        try {
          setIsFetchingSubjects(true);
          form.setValue("subject", ""); // Reset subject when branch/semester changes

          const response = await fetch(
            `/api/subjects?branch=${branch}&semester=${semester}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch subjects");
          }
          const data = await response.json();
          setSubjects(data);
        } catch (error) {
          toast.error("Failed to load subjects");
          setSubjects([]);
        } finally {
          setIsFetchingSubjects(false);
        }
      }
    };

    fetchSubjects();
  }, [branch, semester, form]);

  const onDrop = useCallback(
    (acceptedFiles: FileList | null) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        form.setValue("file", file);
        setFilePreview({
          name: file.name,
          type: file.type,
          size: file.size,
        });
      }
    },
    [form]
  );

  const removeFile = () => {
    form.setValue("file", undefined as any);
    setFilePreview(null);
  };

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", values.file);
      formData.append("title", values.title);
      formData.append("branch", values.branch);
      formData.append("semester", values.semester);
      formData.append("subject", values.subject);

      const res = await fetch("/api/notes", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to save note");
      }

      toast.success("Note uploaded successfully", {
        position: "top-right",
      });

      router.refresh();
    } catch (error) {
      toast.error("Failed to upload note", {
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
      form.reset();
      setFilePreview(null);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 bg-white rounded-lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Title Field */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Note Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter note title"
                    {...field}
                    disabled={isLoading}
                    className="focus-visible:ring-2 focus-visible:ring-primary/50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Branch Dropdown */}
          <FormField
            control={form.control}
            name="branch"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Branch</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  disabled={isLoading}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full focus:ring-2 focus:ring-primary/50">
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {branches.map((branch, idx) => (
                      <SelectItem key={idx} value={branch.code}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Semester Dropdown */}
          <FormField
            control={form.control}
            name="semester"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Semester</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  disabled={isLoading}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full focus:ring-2 focus:ring-primary/50">
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <SelectItem key={sem} value={`${sem}`}>
                        Semester {sem}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Subject Dropdown */}
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Subject</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  disabled={
                    isLoading || !branch || !semester || isFetchingSubjects
                  }
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full focus:ring-2 focus:ring-primary/50">
                      {isFetchingSubjects ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Loading subjects...</span>
                        </div>
                      ) : (
                        <SelectValue
                          placeholder={
                            branch && semester
                              ? "Select subject"
                              : "First select branch and semester"
                          }
                        />
                      )}
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {subjects.length > 0 ? (
                      subjects.map((subject, id) => (
                        <SelectItem key={id} value={subject.name}>
                          {subject.name} ({subject.code})
                        </SelectItem>
                      ))
                    ) : (
                      <div className="py-2 text-center text-sm text-gray-500">
                        {branch && semester
                          ? "No subjects found for this branch and semester"
                          : "Select branch and semester first"}
                      </div>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* File Upload */}
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Note File</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    {!filePreview ? (
                      <label
                        htmlFor="file-upload"
                        className={cn(
                          "relative flex flex-col items-center justify-center w-full py-8 border-2 border-dashed rounded-lg cursor-pointer",
                          "border-gray-300 hover:border-primary bg-gray-50 hover:bg-gray-50/50 transition-colors",
                          "focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
                        )}
                      >
                        <div className="flex flex-col items-center justify-center text-center">
                          <UploadCloud className="w-10 h-10 text-gray-400" />
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold text-primary">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            PDF or DOCX (Max. 10MB)
                          </p>
                        </div>
                        <input
                          id="file-upload"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          disabled={isLoading}
                          className="sr-only"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              field.onChange(file);
                              setFilePreview({
                                name: file.name,
                                type: file.type,
                                size: file.size,
                              });
                            }
                          }}
                        />
                      </label>
                    ) : (
                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-gray-500" />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900 line-clamp-1">
                              {filePreview.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {(filePreview.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={removeFile}
                          className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                          disabled={isLoading}
                        >
                          <X className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="w-full mt-4 cursor-pointer"
          disabled={isLoading || !filePreview}
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            "Upload Note"
          )}
        </Button>
      </form>
    </Form>
  );
}
