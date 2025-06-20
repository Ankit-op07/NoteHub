"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  Sparkles,
  FileText,
  MessageSquare,
  Download,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Share2,
  BookmarkPlus,
  Loader2,
  PanelLeft,
  PanelRight,
  Highlighter,
  StickyNote,
  User,
  Eye,
  ArrowLeft,
  Heart,
  MessageCircle,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import PdfViewer from "@/components/pdf-viewer";

export default function ReadNotePage() {
  const params = useParams();
  const noteId = params.id as string;
  const [noteData, setNoteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDocumentPanel, setShowDocumentPanel] = useState(true);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(45);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<
    { role: string; content: string }[]
  >([
    {
      role: "assistant",
      content:
        "Hello! I can answer questions about this document. What would you like to know?",
    },
  ]);
  const [userQuestion, setUserQuestion] = useState("");
  const [isAskingQuestion, setIsAskingQuestion] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    async function getNote() {
      const res = await fetch(`/api/notes/${noteId}`);
      const data = await res.json();
      setNoteData(data.note);
      setLoading(false);
    }
    getNote();
  }, [noteId]);

  const generateSummary = async () => {
    const res = await fetch(`/api/notes/${noteId}/summary`, { method: "GET" });
    const data = await res.json();
    setIsGeneratingSummary(true);
    console.log("data", data);
    setGeneratedSummary(data.summary);
    // Simulate AI processing
    setTimeout(() => {
      setIsGeneratingSummary(false);
    }, 3000);
  };

  const askQuestion = () => {
    if (!userQuestion.trim()) return;

    // Add user question to chat
    setChatMessages((prev) => [
      ...prev,
      { role: "user", content: userQuestion },
    ]);
    setIsAskingQuestion(true);

    // Simulate AI response
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: getSimulatedAnswer(userQuestion),
        },
      ]);
      setIsAskingQuestion(false);
      setUserQuestion("");
    }, 2000);
  };

  const getSimulatedAnswer = (question: string) => {
    // Simple simulation of AI responses based on keywords in the question
    const q = question.toLowerCase();

    if (q.includes("integration by parts")) {
      return "Integration by parts is a technique used when integrating the product of two functions. The formula is ∫u dv = uv - ∫v du. You should choose u and dv such that u becomes simpler when differentiated and dv is easy to integrate. This technique is particularly useful for integrals like ∫x·sin(x)dx or ∫ln(x)dx.";
    } else if (q.includes("theorem") || q.includes("fundamental theorem")) {
      return "The Fundamental Theorem of Calculus establishes the connection between differentiation and integration. It has two parts: 1) If F(x) is an antiderivative of f(x), then ∫[a,b]f(x)dx = F(b) - F(a). 2) If f is continuous on [a,b], then the function F(x) = ∫[a,x]f(t)dt is continuous on [a,b], differentiable on (a,b), and F'(x) = f(x) for all x in (a,b).";
    } else if (
      q.includes("application") ||
      q.includes("real world") ||
      q.includes("physics")
    ) {
      return "Integration has numerous real-world applications. In physics, it's used to calculate work done by a force, center of mass, and moments of inertia. In engineering, it helps determine areas, volumes, and centroids of complex shapes. In economics, it's used for consumer and producer surplus calculations. The document specifically mentions examples in fluid dynamics (page 8) and structural analysis (page 10).";
    } else {
      return "Based on the document, this topic is covered in detail on pages 3-5. The key points are that calculus provides a framework for modeling change and accumulation. The document explains that integration is essentially finding the area under a curve, which has applications in physics, engineering, economics, and many other fields. Would you like me to elaborate on any specific aspect of this topic?";
    }
  };

  return (
    <TooltipProvider>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="flex flex-col min-h-screen">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b pb-4 bg-white gap-4">
            <div className="flex items-start lg:items-center gap-4">
              <Link href="/dashboard/notes">
                <Button variant="ghost" size="sm" className="flex-shrink-0">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg lg:text-xl font-semibold truncate">
                  {noteData.title}
                </h1>
                <div className="flex flex-wrap items-center gap-2 lg:gap-4 text-sm text-slate-600 mt-1">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{noteData.createdBy.name}</span>
                  </div>
                  <Badge variant="secondary" className="flex-shrink-0">
                    {noteData.subject}
                  </Badge>
                  {/* <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                    <span>{noteData.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3 flex-shrink-0" />
                    <span>{noteData.views}</span>
                  </div> */}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant={isBookmarked ? "default" : "outline"}
                size="sm"
                onClick={() => setIsBookmarked(!isBookmarked)}
                className="text-xs lg:text-sm"
              >
                <BookmarkPlus className="h-4 w-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">
                  {isBookmarked ? "Bookmarked" : "Bookmark"}
                </span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs lg:text-sm"
              >
                <Share2 className="h-4 w-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Download</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAIPanel(!showAIPanel)}
              >
                <Sparkles className="h-4 w-4" />
                <span className="ml-1">AI</span>
              </Button>
            </div>
          </div>

          {/* Main content area */}
          <div className="flex flex-1 overflow-hidden">
            {/* Document panel */}
            {showDocumentPanel && (
              <div
                className={`${showAIPanel ? "hidden lg:block lg:w-3/5" : "w-full"} border-r flex flex-col`}
              >
                {/* Document viewer */}
                <div className="flex-1 overflow-auto px-2 lg:px-4 bg-gray-50">
                  <div
                    className="bg-white shadow rounded-lg mx-auto px-4 lg:px-8"
                    style={{
                      width: `${Math.min(zoomLevel, 100)}%`,
                      maxWidth: "850px",
                      minHeight: "600px",
                    }}
                  >
                    <PdfViewer fileurl={noteData.downloadUrl}></PdfViewer>
                  </div>
                </div>
              </div>
            )}

            {/* AI tools panel */}
            {showAIPanel && (
              <div
                className={`${showDocumentPanel ? "w-full lg:w-2/5" : "w-full"} flex flex-col`}
              >
                <Tabs defaultValue="summarize" className="flex-1 flex flex-col">
                  <div className="border-b bg-white">
                    <TabsList className="w-full justify-start p-0 bg-transparent h-auto">
                      <TabsTrigger
                        value="summarize"
                        className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:shadow-none rounded-none px-3 lg:px-4 py-2 text-xs lg:text-sm"
                      >
                        <FileText className="h-4 w-4 mr-1 lg:mr-2" />
                        <span className="hidden sm:inline">Summarize</span>
                      </TabsTrigger>
                      {/* <TabsTrigger
                      value="chat"
                      className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:shadow-none rounded-none px-3 lg:px-4 py-2 text-xs lg:text-sm"
                    >
                      <MessageSquare className="h-4 w-4 mr-1 lg:mr-2" />
                      <span className="hidden sm:inline">Ask</span>
                    </TabsTrigger> */}
                    </TabsList>
                  </div>

                  {/* Summarize tab */}
                  <TabsContent
                    value="summarize"
                    className="flex-1 flex flex-col m-0 p-0 data-[state=inactive]:hidden"
                  >
                    <div className="p-3 lg:p-4 flex-1 overflow-auto">
                      {isGeneratingSummary ? (
                        <div className="flex flex-col items-center justify-center h-full">
                          <Loader2 className="h-8 w-8 text-purple-600 animate-spin mb-4" />
                          <p className="text-slate-600 text-sm lg:text-base text-center">
                            Analyzing document and generating summary...
                          </p>
                          <p className="text-xs lg:text-sm text-slate-500 mt-2 text-center">
                            This may take a few moments
                          </p>
                        </div>
                      ) : generatedSummary ? (
                        <div className="space-y-4">
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
                            <h3 className="text-base lg:text-lg font-medium flex items-center gap-2">
                              <FileText className="h-5 w-5 text-purple-600" />
                              Summary
                            </h3>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs"
                              >
                                <Copy className="h-4 w-4 mr-1" />
                                <span className="hidden sm:inline">Copy</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs"
                              >
                                <Download className="h-4 w-4 mr-1" />
                                <span className="hidden sm:inline">Save</span>
                              </Button>
                            </div>
                          </div>

                          <div className="prose prose-sm max-w-none text-sm lg:text-base">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: generatedSummary.replace(/\n/g, "<br>"),
                              }}
                            />
                          </div>

                          <div className="flex flex-col lg:flex-row lg:items-center justify-between pt-4 border-t gap-2">
                            <div className="text-xs lg:text-sm text-slate-500">
                              Was this summary helpful?
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs"
                              >
                                <ThumbsUp className="h-4 w-4 mr-1" />
                                Yes
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs"
                              >
                                <ThumbsDown className="h-4 w-4 mr-1" />
                                No
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full p-4">
                          <FileText className="h-12 w-12 text-slate-300 mb-4" />
                          <h3 className="text-base lg:text-lg font-medium mb-2 text-center">
                            Generate Summary
                          </h3>
                          <p className="text-slate-500 text-center text-sm lg:text-base mb-6">
                            Get a concise summary with key points and formulas.
                          </p>
                          <div className="space-y-4 w-full max-w-md">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">
                                Summary Type
                              </label>
                              <Select defaultValue="comprehensive">
                                <SelectTrigger className="text-sm">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="brief">
                                    Brief Overview
                                  </SelectItem>
                                  <SelectItem value="comprehensive">
                                    Comprehensive
                                  </SelectItem>
                                  <SelectItem value="bullet-points">
                                    Bullet Points
                                  </SelectItem>
                                  <SelectItem value="study-notes">
                                    Study Notes
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <Button
                              className="w-full bg-purple-600 hover:bg-purple-700 text-sm"
                              onClick={generateSummary}
                            >
                              <Sparkles className="h-4 w-4 mr-2" />
                              Generate Summary
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* Chat tab */}
                  <TabsContent
                    value="chat"
                    className="flex-1 flex flex-col m-0 p-0 data-[state=inactive]:hidden"
                  >
                    <div className="flex-1 overflow-hidden flex flex-col">
                      <ScrollArea className="flex-1 p-3 lg:p-4">
                        <div className="space-y-4">
                          {chatMessages.map((message, index) => (
                            <div
                              key={index}
                              className={`flex items-start space-x-2 ${message.role === "user" ? "justify-end" : ""}`}
                            >
                              {message.role === "assistant" && (
                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                                  <Sparkles className="h-4 w-4 text-purple-600" />
                                </div>
                              )}
                              <div
                                className={`p-3 rounded-lg shadow-sm max-w-[85%] ${
                                  message.role === "user"
                                    ? "bg-purple-600 text-white"
                                    : "bg-white border"
                                }`}
                              >
                                <p className="text-sm whitespace-pre-wrap">
                                  {message.content}
                                </p>
                              </div>
                              {message.role === "user" && (
                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                                  <span className="text-xs font-medium text-purple-600">
                                    You
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                          {isAskingQuestion && (
                            <div className="flex items-start space-x-2">
                              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <Sparkles className="h-4 w-4 text-purple-600" />
                              </div>
                              <div className="p-3 rounded-lg shadow-sm max-w-[85%] bg-white border">
                                <div className="flex items-center space-x-2">
                                  <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                                  <p className="text-sm text-slate-500">
                                    Thinking...
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </ScrollArea>

                      <div className="p-3 lg:p-4 border-t">
                        <div className="flex space-x-2">
                          <Input
                            placeholder="Ask about this document..."
                            className="flex-1 text-sm"
                            value={userQuestion}
                            onChange={(e) => setUserQuestion(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !isAskingQuestion) {
                                askQuestion();
                              }
                            }}
                          />
                          <Button
                            className="bg-purple-600 hover:bg-purple-700 flex-shrink-0"
                            onClick={askQuestion}
                            disabled={isAskingQuestion || !userQuestion.trim()}
                            size="sm"
                          >
                            {isAskingQuestion ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <ArrowRight className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1 lg:gap-2">
                          <Badge
                            variant="outline"
                            className="cursor-pointer hover:bg-slate-100 text-xs"
                            onClick={() =>
                              setUserQuestion("What is integration by parts?")
                            }
                          >
                            Integration by parts?
                          </Badge>
                          <Badge
                            variant="outline"
                            className="cursor-pointer hover:bg-slate-100 text-xs"
                            onClick={() =>
                              setUserQuestion("Explain the fundamental theorem")
                            }
                          >
                            Fundamental theorem
                          </Badge>
                          <Badge
                            variant="outline"
                            className="cursor-pointer hover:bg-slate-100 text-xs"
                            onClick={() =>
                              setUserQuestion("Real-world applications?")
                            }
                          >
                            Applications
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </div>
      )}
    </TooltipProvider>
  );
}
