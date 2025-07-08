"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Star, Download, User, BookmarkMinus } from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react";

export default function BookmarkedNotesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [notes, setNotes] = useState([])
  const { data: session } = useSession();

  const fetchFavourites = async () => {
    try {
      const res = await fetch('/api/favourites')
      const data = await res.json()
      setNotes(data.Favourites || [])
    } catch (err) {
      console.error("Failed to fetch favourites:", err)
    }
  }

  const removeBookmark = async (note) => {
    const noteId = note._id;
    
    // Optimistically update the UI
    setNotes(prevNotes => prevNotes.filter(n => n._id !== noteId));

    try {
      await fetch('/api/favourites', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ noteId }),
      });
      fetchFavourites()
    } catch (err) {
      // Revert if API fails
      setNotes(prevNotes => [...prevNotes, note]);
      console.error("Failed to remove bookmark:", err);
    }
  };

  const fileSize = (size) => {
    const bytes = parseInt(size)
    const mb = 1024 * 1024
    const kb = 1024
    return bytes > mb ? `${(bytes / mb).toFixed(2)} MB` : `${(bytes / kb).toFixed(2)} KB`
  }

  useEffect(() => {
    fetchFavourites()
  }, [])

  const filteredNotes = useMemo(() => {
    return notes.filter(
      (note) =>
        note.note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.note.subject.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [notes, searchQuery])

  return (
    <div className="space-y-4">
      {/* Search */}
      <Card className="border-slate-200">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Star className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search your bookmarked notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">Showing {filteredNotes.length} bookmarked notes</p>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredNotes.map((note, index) => (
          <Card key={index} className="border-slate-200 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {note.note.subject}
                  </Badge>
                  <Button 
                    onClick={() => removeBookmark(note.note)} 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0 cursor-pointer"
                    title="Remove bookmark"
                  >
                    <BookmarkMinus className="h-3 w-3 text-red-500" />
                  </Button>
                </div>
                <h3 className="font-medium text-slate-900 line-clamp-2 text-sm leading-tight">{note.note.title}</h3>
                <div className="text-xs text-slate-600">
                  <div className="flex items-center space-x-1 mb-1">
                    <User className="h-3 w-3" />
                    <span>{note.note.createdBy.name}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{note.note.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Download className="h-3 w-3" />
                      <span>{note.note.downloads}</span>
                    </div>
                  </div>
                  <span>{fileSize(note.note.fileSize)}</span>
                </div>
                <Link key={note.note._id} href={`/dashboard/notes/${note._id}`}>
                  <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer">
                    View Notes
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Star className="h-12 w-12 text-slate-300" />
          <p className="text-slate-500">No bookmarked notes found</p>
          <p className="text-sm text-slate-400">Save notes by clicking the bookmark icon</p>
        </div>
      )}
    </div>
  )
}