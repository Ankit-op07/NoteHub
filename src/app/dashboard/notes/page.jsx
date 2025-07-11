"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Star, Download, Eye, User, Bookmark, Grid, List, BookmarkPlus, BookmarkMinus } from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react";

export default function BrowseNotesPage() {
  const [viewMode, setViewMode] = useState("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [notes, setNotes] = useState([])
  const [subjects, setSubjects] = useState([])
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [sortOption, setSortOption] = useState("recent")
  const { data: session } = useSession();

  const fetchNotes = async () => {
    const data = {
      branch: null,
      semester: null,
    }

    const queryParams = new URLSearchParams(data)
    const url = `/api/notes`
    try {
      const res = await fetch(url)
      const data = await res.json()
      setNotes(data.notes || [])
    } catch (err) {
      console.error("Failed to fetch notes:", err)
    }
  }

  const fetchSubject = async () => {
    const branch = session?.user?.branch
    const semester = session?.user?.semester
    let subjects = []
    if (branch && semester) {
      subjects = await fetch(`/api/subjects?branch=${branch}&semester=${semester}`)
    } else {
      subjects = await fetch(`/api/subjects`)
    }
    const data = await subjects.json()
    setSubjects(data)
  }

  useEffect(() => {
    fetchNotes()
    fetchSubject()
  }, [])

  const bookmarkNote = async (note) => {
    const isFav = note.isFavourite;
    const noteId = note._id;
    
    // Optimistically update the UI
    setNotes(prevNotes => prevNotes.map(n => 
      n._id === noteId ? { ...n, isFavourite: !isFav } : n
    ));

    try {
      if (isFav) {
        await fetch('/api/favourites', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ noteId }),
        });
      } else {
        await fetch('/api/favourites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ noteId }),
        });
      }
    } catch (err) {
      // Revert if API fails
      setNotes(prevNotes => prevNotes.map(n => 
        n._id === noteId ? { ...n, isFavourite: isFav } : n
      ));
      console.error("Bookmark update failed:", err);
    }
  };

  const fileSize = (size) => {
    const bytes = parseInt(size)
    const mb = 1024 * 1024
    const kb = 1024
    return bytes > mb ? `${(bytes / mb).toFixed(2)} MB` : `${(bytes / kb).toFixed(2)} KB`
  }

  const handleSubjectChange = (value) => {
    setSelectedSubject(value);
  };

  const handleSortChange = (value) => {
    setSortOption(value);
  };

  const filteredNotes = useMemo(() => {
    let result = notes.filter(
      (note) =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.createdBy.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Filter by selected subject
    if (selectedSubject !== "all") {
      result = result.filter(note => note.subject === selectedSubject);
    }

    // Sort notes based on selected option
    switch (sortOption) {
      case "recent":
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "popular":
        result.sort((a, b) => b.downloads - a.downloads);
        break;
      case "rated":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return result;
  }, [notes, searchQuery, selectedSubject, sortOption]);

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <Card className="border-slate-200">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search notes, subjects, authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-3">
              <Select value={selectedSubject} onValueChange={handleSubjectChange}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map((subject, Idx) => {
                    return (
                      <SelectItem key={Idx} value={subject.code}>{subject.name}</SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
              <Select value={sortOption} onValueChange={handleSortChange}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="rated">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex border border-slate-200 rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  disabled
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">Showing {filteredNotes.length} notes</p>
      </div>
      {/* Notes Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredNotes.map((note, index) => (
            <Card key={index} className="border-slate-200 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {note.subject}
                    </Badge>
                    <Button onClick={() => bookmarkNote(note)} variant="ghost" size="sm" className="h-6 w-6 p-0 cursor-pointer">
                      {note.isFavourite ? <BookmarkMinus className="h-3 w-3" /> : <BookmarkPlus className="h-3 w-3" />}
                    </Button>
                  </div>
                  <h3 className="font-medium text-slate-900 line-clamp-2 text-sm leading-tight">{note.title}</h3>
                  <div className="text-xs text-slate-600">
                    <div className="flex items-center space-x-1 mb-1">
                      <User className="h-3 w-3" />
                      <span>{note.createdBy.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center space-x-2">
                     <div className="flex items-center space-x-1">
                        <Eye className="h-3 w-3" />
                        <span>{note.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{note.rating}</span>
                      </div>
                    </div>
                    <span>{fileSize(note.fileSize)}</span>
                  </div>
                  <Link key={note._id} href={`/dashboard/notes/${note._id}`}>
                    <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer">
                      View Notes
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotes.map((note, index) => (
            <Card className="border-slate-200 hover:shadow-md transition-shadow" key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-slate-900">{note.title}</h3>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Bookmark onClick={() => bookmarkNote(note)} className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-slate-600">
                      <Badge variant="secondary" className="text-xs">
                        {note.subject}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>
                          {note.author} • {note.university}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{note.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Download className="h-3 w-3" />
                          <span>{note.downloads}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>{note.views}</span>
                        </div>
                        <span>
                          {note.pages} pages • {note.fileSize}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link key={note._id} href={`/dashboard/notes/${note._id}`}>
                    <Button size="sm" className="ml-4 bg-blue-600 hover:bg-blue-700 cursor-pointer">
                      View Notes
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}