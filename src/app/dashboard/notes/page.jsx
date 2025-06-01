"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Download, Search, Eye, X, Calendar, User, BookOpen, Star, Share2, Grid, List, Maximize2 } from "lucide-react"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export default function NotesViewer() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [subjectFilter, setSubjectFilter] = useState("")
  const [selectedNote, setSelectedNote] = useState(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [viewMode, setViewMode] = useState("list") // "grid" or "list"

  useEffect(() => {
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
        // Add mock data for demonstration
        const notesWithMockData = (data.notes || []).map((note, index) => ({
          ...note,
          fileSize: Math.floor(Math.random() * 10) + 1 + " MB",
          uploadDate: new Date(note.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          views: Math.floor(Math.random() * 500) + 10,
          rating: (Math.random() * 2 + 3).toFixed(1),
          author: note.createdBy.name || 'Admin',
          pages: Math.floor(Math.random() * 50) + 10,
          // tags: ["Important", "Exam", "Theory", "Practice"].slice(0, Math.floor(Math.random() * 3) + 1),
        }))
        setNotes(notesWithMockData)
      } catch (err) {
        console.error("Failed to fetch notes:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchNotes()
  }, [])

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.subject.toLowerCase().includes(search.toLowerCase()) ||
      note.author?.toLowerCase().includes(search.toLowerCase())

    const matchesSubject = subjectFilter && subjectFilter !== "all" ? note.subject === subjectFilter : true

    return matchesSearch && matchesSubject
  })

  const uniqueSubjects = [...new Set(notes.map((note) => note.subject))]

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatViews = (views) => (views > 1000 ? `${(views / 1000).toFixed(1)}k` : views)

  const openPreview = (note) => {
    setSelectedNote(note)
    setIsPanelOpen(true)
  }

  const closePreview = () => {
    setIsPanelOpen(false)
    setSelectedNote(null)
  }

  const clearAllFilters = () => {
    setSearch("")
    setSubjectFilter("")
  }

  // Custom Study Notes Icon Component
  const StudyNotesIcon = ({ className = "h-6 w-6" }) => (
    <div className="relative">
      <svg viewBox="0 0 24 24" className={className} fill="currentColor">
        {/* Main document */}
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="currentColor" opacity="0.9" />
        {/* Folded corner */}
        <path d="m14,2l6,6h-6V2Z" fill="currentColor" opacity="0.7" />
        {/* Text lines */}
        <line x1="8" y1="12" x2="16" y2="12" stroke="white" strokeWidth="0.8" opacity="0.8" />
        <line x1="8" y1="14" x2="14" y2="14" stroke="white" strokeWidth="0.8" opacity="0.8" />
        <line x1="8" y1="16" x2="15" y2="16" stroke="white" strokeWidth="0.8" opacity="0.8" />
        <line x1="8" y1="18" x2="13" y2="18" stroke="white" strokeWidth="0.8" opacity="0.8" />
        {/* Bullet points */}
        <circle cx="7" cy="12" r="0.8" fill="white" opacity="0.6" />
        <circle cx="7" cy="14" r="0.8" fill="white" opacity="0.6" />
        <circle cx="7" cy="16" r="0.8" fill="white" opacity="0.6" />
      </svg>
    </div>
  )

  return (
    <div className="relative">
      {/* Main Content */}
      <div className="space-y-4 p-6">
        {/* Compact Search and Filter Bar */}
        <div className="flex flex-wrap gap-3 items-center bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 text-sm border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 cursor-text"
            />
          </div>

          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger className="h-10 w-[160px] border-gray-200 text-sm rounded-lg cursor-pointer">
              <SelectValue placeholder="All Subjects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {uniqueSubjects.map((subject) => (
                <SelectItem key={subject} value={subject} className="cursor-pointer">
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0 cursor-pointer"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0 cursor-pointer"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {(search || subjectFilter) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-10 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>

        {/* Results Count */}
        {!loading && (
          <div className="text-sm text-gray-500 px-1">
            Showing {filteredNotes.length} of {notes.length} notes
            {subjectFilter && subjectFilter !== "all" && (
              <span className="ml-1">
                in <span className="font-medium text-gray-700">{subjectFilter}</span>
              </span>
            )}
          </div>
        )}

        {/* Notes Grid/List View */}
        {loading ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <Card key={i} className="border-0 shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <Skeleton className="h-12 w-10 rounded" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-3 w-2/3" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-8 flex-1" />
                      <Skeleton className="h-8 flex-1" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="border-0 shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex gap-4">
                      <Skeleton className="h-16 w-12 rounded flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <div className="flex gap-2">
                          <Skeleton className="h-6 w-16" />
                          <Skeleton className="h-6 w-16" />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Skeleton className="h-9 w-20" />
                        <Skeleton className="h-9 w-24" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )
        ) : filteredNotes.length > 0 ? (
          viewMode === "grid" ? (
            // Grid View
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredNotes.map((note) => (
                <Card
                  key={note._id}
                  className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:shadow-blue-500/20 cursor-pointer bg-gradient-to-br from-white to-gray-50/50 hover:from-blue-50/30 hover:to-indigo-50/30"
                  onClick={() => openPreview(note)}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-xl transition-shadow">
                        <StudyNotesIcon className="h-7 w-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm line-clamp-2 text-gray-900 group-hover:text-blue-700 transition-colors leading-tight mb-2">
                          {note.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Badge
                            variant="secondary"
                            className="text-xs px-2 py-0.5 h-5 bg-blue-100 text-blue-700 border-0"
                          >
                            {note.subject}
                          </Badge>
                          <div className="flex items-center">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400 mr-0.5" />
                            <span className="font-medium">{note.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 h-9 text-xs border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation()
                          openPreview(note)
                        }}
                      >
                        <Eye className="h-3 w-3 mr-1.5" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 h-9 text-xs bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation()
                          const link = document.createElement("a")
                          link.href = note.downloadUrl
                          link.download = `${note.title.replace(/\s+/g, "_")}.pdf`
                          link.click()
                        }}
                      >
                        <Download className="h-3 w-3 mr-1.5" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            // List View
            <div className="space-y-3">
              {filteredNotes.map((note) => (
                <Card
                  key={note._id}
                  className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:shadow-blue-500/20 cursor-pointer bg-gradient-to-r from-white to-gray-50/50 hover:from-blue-50/30 hover:to-indigo-50/30"
                  onClick={() => openPreview(note)}
                >
                  <CardContent className="p-5">
                    <div className="flex gap-4">
                      {/* Document Thumbnail */}
                      <div className="flex-shrink-0">
                        <div className="w-14 h-18 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                          <StudyNotesIcon className="h-8 w-8 text-white" />
                        </div>
                      </div>

                      {/* Document Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-base line-clamp-1 text-gray-900 group-hover:text-blue-700 transition-colors">
                            {note.title}
                          </h3>
                          <div className="flex items-center gap-1 text-sm text-gray-500 ml-3">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <span className="font-medium">{note.rating}</span>
                          </div>
                        </div>

                        <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mb-2">
                          <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 border-0">
                            {note.subject}
                          </Badge>
                          <span className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {note.author}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(note.uploadDate).split(", ")[0]}
                          </span>
                          {/* <span className="flex items-center">
                            <Eye className="h-3 w-3 mr-1" />
                            {formatViews(note.views)}
                          </span> */}
                          <span className="flex items-center">
                            <BookOpen className="h-3 w-3 mr-1" />
                            {note.pages} pages
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 w-20 text-xs border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation()
                            openPreview(note)
                          }}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          className="h-9 w-24 text-xs bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation()
                            const link = document.createElement("a")
                            link.href = note.downloadUrl
                            link.download = `${note.title.replace(/\s+/g, "_")}.pdf`
                            link.click()
                          }}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )
        ) : (
          <Card className="border-0 shadow-md bg-gradient-to-br from-white to-gray-50">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                <StudyNotesIcon className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No notes found</h3>
              <p className="text-gray-600 text-center max-w-md mb-4">
                {search || subjectFilter ? (
                  <>
                    No notes match your search criteria. Try adjusting your search terms or selecting a different
                    subject.
                  </>
                ) : (
                  <>No notes are available at the moment. Check back later for new uploads.</>
                )}
              </p>
              {(search || subjectFilter) && (
                <Button variant="outline" onClick={clearAllFilters} className="hover:bg-blue-50 cursor-pointer">
                  Clear filters
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Right Side Panel for PDF Viewer - Overlay */}
      {isPanelOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/20 z-40" onClick={closePreview} />

          {/* Panel */}
          <div className="fixed right-0 top-0 h-full w-[55vw] bg-white shadow-2xl z-50 flex flex-col border-l border-gray-200">
            {/* Panel Header */}
            <div className="p-4 border-b bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-md">
                  <StudyNotesIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 line-clamp-1">{selectedNote?.title}</h3>
                  <p className="text-xs text-gray-500">
                    {selectedNote?.pages} pages • {selectedNote?.fileSize}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-50 cursor-pointer" asChild>
                  <a href={selectedNote?.downloadUrl} target="_blank" rel="noopener noreferrer">
                    <Maximize2 className="h-4 w-4 mr-2" />
                    Full Screen
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closePreview}
                  className="hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* PDF Viewer */}
            <div className="flex-1 p-4 bg-gray-50">
              <div className="w-full h-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                <iframe
                  src={selectedNote?.downloadUrl}
                  className="w-full h-full border-0"
                  title={`PDF Viewer - ${selectedNote?.title}`}
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-4 border-t bg-white flex gap-3">
              <Button
                className="flex-1 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all cursor-pointer"
                asChild
              >
                <a href={selectedNote?.downloadUrl} download={`${selectedNote?.title.replace(/\s+/g, "_")}.pdf`}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </a>
              </Button>
              <Button variant="outline" className="flex-1 h-10 border-gray-300 hover:bg-gray-50 cursor-pointer">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
