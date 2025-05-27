"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";

export default function NotesViewer() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [userBranch, setUserBranch] = useState("");
  const [userSemester, setUserSemester] = useState("");

  useEffect(() => {
    const fetchNotes = async () => {
      const data = {
        branch: localStorage.getItem("branch"),
        semester: localStorage.getItem("semester"),
      }
      const queryParams = new URLSearchParams(data);
      const url = `/api/notes?${queryParams.toString()}`;
      try {
        const res = await fetch(url);
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

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.subject.toLowerCase().includes(search.toLowerCase()) ||
      note.branch.toLowerCase().includes(search.toLowerCase());

    const matchesBranch = branchFilter ? note.branch === branchFilter : true;
    const matchesSemester = semesterFilter ? note.semester === semesterFilter : true;
    const matchesSubject = subjectFilter ? note.subject === subjectFilter : true;

    return matchesSearch && matchesBranch && matchesSemester && matchesSubject;
  });

  const uniqueBranches = [...new Set(notes.map(note => note.branch))];
  const uniqueSemesters = [...new Set(notes.map(note => note.semester))];
  const uniqueSubjects = [...new Set(notes.map(note => note.subject))];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-2 text-center">Explore Notes</h1>

            <div>
          {/* <Label htmlFor="search" className="text-base mb-2 block">
            Search Notes
          </Label> */}
          <Input
            id="search"
            placeholder="Search by title, subject or branch..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-xl mb-2"
          />
        </div>
      <div className="mb-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        <div>
          {/* <Label className="block mb-1">Filter by Branch</Label> */}
          <Select value={branchFilter} onValueChange={(value) => setBranchFilter(value)}>
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="All Branches" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              {uniqueBranches.map(branch => (
                <SelectItem key={branch} value={branch}>{branch}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          {/* <Label className="block mb-1">Filter by Semester</Label> */}
          <Select value={semesterFilter} onValueChange={(value) => setSemesterFilter(value)}>
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="All Semesters" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              {uniqueSemesters.map(sem => (
                <SelectItem key={sem} value={sem}>{sem}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          {/* <Label className="block mb-1">Filter by Subject</Label> */}
          <Select value={subjectFilter} onValueChange={(value) => setSubjectFilter(value)}>
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="All Subjects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              {uniqueSubjects.map(sub => (
                <SelectItem key={sub} value={sub}>{sub}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <ScrollArea className="h-[600px] pr-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-48 w-full rounded-2xl" />
              ))
            : filteredNotes.map((note) => (
                <Card key={note._id} className="hover:shadow-lg transition-shadow border border-gray-200 rounded-2xl">
                  <CardContent className="p-5 flex flex-col gap-3">
                    <h2 className="font-bold text-xl line-clamp-1">
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
                    <div className="flex justify-between items-center mt-auto">
                      <a
                        href={note.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm font-medium"
                      >
                        View PDF
                      </a>
                      <a
                        href={note.fileUrl}
                        download={note.title + ".pdf"}
                        className="text-green-600 hover:text-green-800 flex items-center gap-1 text-sm font-medium"
                      >
                        <Download className="w-4 h-4" /> Download
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
