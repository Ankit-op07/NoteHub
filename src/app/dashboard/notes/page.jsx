"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Download,
  Search,
  Eye,
  X,
  BookOpen,
  Star,
  Share2,
  MoreVertical,
  ExternalLink,
  Bookmark,
  FileText,
  SlidersHorizontal,
} from "lucide-react"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Modern Star Rating Component
const StarRating = ({ rating, onRatingChange, readonly = false, size = "sm" }) => {
  const [hoverRating, setHoverRating] = useState(0)
  const starSize = size === "sm" ? "h-4 w-4" : "h-5 w-5"

  const handleClick = (star, e) => {
    e.stopPropagation()
    if (!readonly && onRatingChange) {
      onRatingChange(star)
    }
  }

  const handleMouseEnter = (star, e) => {
    e.stopPropagation()
    if (!readonly) {
      setHoverRating(star)
    }
  }

  const handleMouseLeave = (e) => {
    e.stopPropagation()
    if (!readonly) {
      setHoverRating(0)
    }
  }

  return (
    <div className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          className={`${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"} transition-all duration-150`}
          onMouseEnter={(e) => handleMouseEnter(star, e)}
          onMouseLeave={handleMouseLeave}
          onClick={(e) => handleClick(star, e)}
        >
          <Star
            className={`${starSize} transition-all duration-150 ${
              star <= (hoverRating || rating)
                ? "fill-yellow-400 text-yellow-400"
                : readonly
                  ? "text-gray-300"
                  : "text-gray-300 hover:text-yellow-300"
            }`}
          />
        </button>
      ))}
    </div>
  )
}

export default function NotesViewer() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [subjectFilter, setSubjectFilter] = useState("")
  const [sortBy, setSortBy] = useState("recent")
  const [selectedNote, setSelectedNote] = useState(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [favorites, setFavorites] = useState(new Set())
  const [userRatings, setUserRatings] = useState({})


      const fetchNotes = async () => {
      const data = {
        branch: localStorage.getItem("branch"),
        semester: localStorage.getItem("semester"),
      }

      const queryParams = new URLSearchParams(data)
      const url = `/api/notes?${queryParams.toString()}`
      try {
        const res = await fetch(url)
        const data = await res.json()
        setNotes(data.notes || [])
      } catch (err) {
        console.error("Failed to fetch notes:", err)
      } finally {
        setLoading(false)
      }
    }

  useEffect(() => {
    fetchNotes()
  }, [])

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title?.toLowerCase().includes(search.toLowerCase()) ||
      note.subject?.toLowerCase().includes(search.toLowerCase()) ||
      note.author?.toLowerCase().includes(search.toLowerCase())

    const matchesSubject = subjectFilter && subjectFilter !== "all" ? note.subject === subjectFilter : true

    return matchesSearch && matchesSubject
  })

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.uploadDate || 0) - new Date(a.uploadDate || 0)
      case "popular":
        return (b.views || 0) - (a.views || 0)
      case "rating":
        return (b.rating || 0) - (a.rating || 0)
      case "title":
        return (a.title || "").localeCompare(b.title || "")
      default:
        return 0
    }
  })

  const uniqueSubjects = [...new Set(notes.map((note) => note.subject).filter(Boolean))]

  const formatViews = (views) => {
    if (!views) return "0"
    if (views > 1000000) return `${(views / 1000000).toFixed(1)}M`
    if (views > 1000) return `${(views / 1000).toFixed(1)}k`
    return views.toString()
  }

  const openPreview = (note) => {
    setSelectedNote(note)
    setIsPanelOpen(true)
    fetch(`/api/notes/${note._id}/views`, {
      method: 'POST',
    })
  }

  const closePreview = () => {
    setIsPanelOpen(false)
    setSelectedNote(null)
  }

  const toggleFavorite = (noteId, e) => {
    e.stopPropagation()


    const newFavorites = new Set(favorites)
    if (newFavorites.has(noteId)) {
      newFavorites.delete(noteId)
      fetch('/api/favourites', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ noteId }),
    })
    } else {
      newFavorites.add(noteId)
      fetch('/api/favourites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ noteId }),
    })
    }
    fetchNotes()
    setFavorites(newFavorites)
  }

  const handleRating = (noteId, rating) => {
    setUserRatings((prev) => ({ ...prev, [noteId]: rating }))
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-50 text-red-600 border-red-200"
      case "Medium":
        return "bg-yellow-50 text-yellow-600 border-yellow-200"
      case "Low":
        return "bg-green-50 text-green-600 border-green-200"
      default:
        return "bg-gray-50 text-gray-600 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search notes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {/* Subject Filter */}
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger className="w-48 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {uniqueSubjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recent</SelectItem>
                  <SelectItem value="popular">Popular</SelectItem>
                  <SelectItem value="rating">Top Rated</SelectItem>
                  <SelectItem value="title">A-Z</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear Button */}
              {(search || subjectFilter) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearch("")
                    setSubjectFilter("")
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>

            {/* Results Info */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                Showing {sortedNotes.length} of {notes.length} notes
                {subjectFilter && subjectFilter !== "all" && (
                  <span className="ml-2">
                    in{" "}
                    <Badge variant="secondary" className="ml-1">
                      {subjectFilter}
                    </Badge>
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Notes Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="border border-gray-200 bg-white">
                <CardContent className="p-4">
                  <div className="animate-pulse">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="flex gap-2 mb-3">
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                    </div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="h-9 bg-gray-200 rounded"></div>
                      <div className="h-9 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : sortedNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedNotes.map((note) => (
              <Card
                key={note.id || note._id}
                className={`border hover:border-gray-300 hover:shadow-md transition-all duration-200 bg-white relative ${
                  favorites.has(note.id || note._id) ? "border-red-200 bg-red-50/30" : "border-gray-200"
                }`}
              >
                <CardContent className="p-4">
                  {/* Favorite Indicator */}
                  {note.isFavourite && (
                    <div className="absolute top-2 left-2">
                      <Bookmark className="h-5 w-5 fill-gray-600 text-gray-500" />
                    </div>
                  )}

                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 line-clamp-2 text-sm leading-5 mb-1">{note.title}</h3>
                        <div className="text-sm text-gray-500">{note?.createdBy.name}</div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 flex-shrink-0 text-gray-400 hover:text-gray-600"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFavorite(note._id, e)
                          }}
                        >
                          <Bookmark
                            className={`h-4 w-4 mr-2 ${
                              note.isFavourite ? "fill-gray-600 " : ""
                            }`}
                          />
                          {note.isFavourite ? "Remove from Bookmarks" : "Add to Bookmarks"}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share2 className="h-4 w-4 mr-2" />
                          Share Note
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => window.open(note.downloadUrl)}>
                          <ExternalLink  className="h-4 w-4 mr-2" />
                          Open in New Tab
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Subject and Priority Badges */}
                  <div className="flex gap-2 mb-3">
                    <Badge variant="outline" className="text-xs border-gray-300 text-gray-600 px-2 py-1">
                      {note.subject}
                    </Badge>
                    {/* <Badge variant="outline" className={`text-xs px-2 py-1 ${getPriorityColor(note.priority)}`}>
                      {note.priority || "Medium"}
                    </Badge> */}
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{formatViews(note.views)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      <span>{note.downloads || 0}</span>
                    </div>
                  </div>

                  {/* Modern Rating Display */}
                  <div className="flex items-center gap-2 mb-3">
                    <StarRating rating={note.rating || 0} readonly size="sm" />
                    <span className="text-sm font-medium text-gray-900">{note.rating || 0}</span>
                    <span className="text-xs text-gray-500">({note.ratingCount || 0} ratings)</span>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                      onClick={() => openPreview(note)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={(e) => {
                        e.stopPropagation()
                        const link = document.createElement("a")
                        link.target = "_blank"
                        link.href = note.downloadUrl
                        link.download = `${note.title.replace(/\s+/g, "_")}.pdf`
                        link.click()
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notes found</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              {search || subjectFilter
                ? "No notes match your search criteria. Try adjusting your filters."
                : "No study notes are available at the moment."}
            </p>
            {(search || subjectFilter) && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearch("")
                  setSubjectFilter("")
                }}
              >
                Clear all filters
              </Button>
            )}
          </div>
        )}
      </div>

      {/* PDF Viewer Panel */}
      {isPanelOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={closePreview} />
          <div className="fixed right-0 top-0 h-full w-[60vw] bg-white shadow-xl z-50 flex flex-col border-l border-gray-200">
            {/* Minimal Panel Header */}
            <div className="p-3 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{selectedNote?.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Rate:</span>
                    <StarRating
                      rating={userRatings[selectedNote?.id || selectedNote?._id] || 0}
                      onRatingChange={(rating) => handleRating(selectedNote?.id || selectedNote?._id, rating)}
                      size="sm"
                    />
                  </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-7 text-xs" asChild>
                    <a href={selectedNote?.downloadUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Full Screen
                    </a>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={closePreview}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Maximized PDF Viewer */}
            <div className="flex-1 p-2 bg-gray-50">
              <div className="w-full h-full bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                <iframe
                  src={selectedNote?.downloadUrl}
                  className="w-full h-full border-0"
                  title={`PDF Viewer - ${selectedNote?.title}`}
                />
              </div>
            </div>

            {/* Minimal Panel Footer */}
            <div className="p-1 border-t border-gray-200 bg-white">
              {/* Rating Section */}
              {/* <div className="bg-gray-50 rounded-lg p-2 mb-">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Rate:</span>
                    <StarRating
                      rating={userRatings[selectedNote?.id || selectedNote?._id] || 0}
                      onRatingChange={(rating) => handleRating(selectedNote?.id || selectedNote?._id, rating)}
                      size="sm"
                    />
                  </div>
                </div>
              </div> */}

              {/* <div className="flex gap-2">
                <Button className="flex-1 h-8 text-sm bg-blue-600 hover:bg-blue-700" asChild>
                  <a
                    href={selectedNote?.downloadUrl || selectedNote?.pdfUrl || selectedNote?.fileUrl}
                    download={`${selectedNote?.title.replace(/\s+/g, "_")}.pdf`}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </a>
                </Button>
                <Button variant="outline" className="flex-1 h-8 text-sm border-gray-300 hover:border-gray-400">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-gray-300 hover:border-gray-400"
                  onClick={(e) => toggleFavorite(selectedNote?.id || selectedNote?._id, e)}
                >
                  <Bookmark
                    className={`h-4 w-4 ${
                      favorites.has(selectedNote?.id || selectedNote?._id)
                        ? "fill-gray-500 text-gray-500"
                        : "text-gray-400"
                    }`}
                  />
                </Button>
              </div> */}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
