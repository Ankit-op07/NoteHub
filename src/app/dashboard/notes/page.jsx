"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function NotesViewer() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch("/api/notes");
        const data = await res.json();
        setNotes(data.notes || []);
      } catch (err) {
        console.error("Failed to fetch notes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(search.toLowerCase()) ||
    note.subject.toLowerCase().includes(search.toLowerCase()) ||
    note.branch.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Available Notes</h1>

      <div className="mb-6">
        <Label htmlFor="search" className="text-base mb-2 block">
          Search Notes
        </Label>
        <Input
          id="search"
          placeholder="Search by title, subject or branch..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <ScrollArea className="h-[600px] pr-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-40 w-full rounded-xl" />
              ))
            : filteredNotes.map((note) => (
                <Card key={note._id} className="hover:shadow-xl transition-shadow">
                  <CardContent className="p-4 flex flex-col gap-2">
                    <h2 className="font-semibold text-lg line-clamp-1">
                      {note.title}
                    </h2>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {note.description || "No description provided."}
                    </p>
                    <div className="text-sm text-muted-foreground">
                      <strong>Subject:</strong> {note.subject}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <strong>Branch:</strong> {note.branch} | <strong>Semester:</strong> {note.semester}
                    </div>
                    <div className="flex gap-2 mt-auto">
                      <a
                        href={note.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        View PDF
                      </a>
                      <a
                        href={note.fileUrl}
                        download
                        className="text-sm text-green-600 hover:underline flex items-center gap-1"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>
      </ScrollArea>
    </div>
  );
}