import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Users,
  Upload,
  Search,
  Star,
  ArrowRight,
  GraduationCap,
  FileText,
  Share2,
  Download,
  CheckCircle,
  Sparkles,
  ScanText,
  FileSearch,
  FolderOpen,
  Clock,
  TrendingUp,
  Shield,
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      {/* Premium Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50"></div>

        {/* Floating Notes Animation */}
        <div className="floating-note absolute top-20 left-[10%] w-16 h-20 bg-white/60 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 rotate-12"></div>
        <div className="floating-note-delayed absolute top-32 right-[15%] w-20 h-24 bg-gradient-to-br from-blue-100/60 to-purple-100/60 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 -rotate-6"></div>
        <div className="floating-note absolute bottom-40 left-[20%] w-18 h-22 bg-gradient-to-br from-green-100/60 to-blue-100/60 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 rotate-3"></div>
        <div className="floating-note-delayed absolute bottom-32 right-[25%] w-16 h-20 bg-gradient-to-br from-purple-100/60 to-pink-100/60 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 -rotate-12"></div>

        {/* Gradient Orbs */}
        <div className="gradient-orb absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="gradient-orb-delayed absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
      </div>

      {/* Premium Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/80 backdrop-blur-xl slide-down">
        <div className="container max-w-7xl mx-auto flex h-14 items-center justify-between px-6">
          <Link href="/" className="flex items-center space-x-2 premium-hover">
            <div className="flex items-center justify-center w-7 h-7 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CollegeBuddy
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="#features"
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-all duration-300 premium-hover"
            >
              Features
            </Link>
            <Link
              href="#smart-tools"
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-all duration-300 premium-hover"
            >
              Smart Tools
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-all duration-300 premium-hover"
            >
              How It Works
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-all duration-300 premium-hover"
            >
              Pricing
            </Link>
            <Link
              href="#community"
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-all duration-300 premium-hover"
            >
              Community
            </Link>
          </nav>
          <div className="flex items-center space-x-3">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-all duration-300 premium-hover"
            >
              Login
            </Link>
            <Link href="/signup">
              <Button
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg premium-hover"
              >
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 relative">
        {/* Premium Hero Section */}
        <section className="w-full py-16 md:py-20 relative overflow-hidden">
          <div className="container max-w-6xl mx-auto px-6 relative">
            <div className="flex flex-col items-center space-y-6 text-center">
              <div className="space-y-4 hero-content">
                <Badge
                  variant="secondary"
                  className="px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 bounce-in"
                >
                  📚 Student-to-Student Note Sharing
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 bg-clip-text text-transparent leading-tight">
                  Your College Notes,
                  <br />
                  <span className="premium-gradient-text">
                    Shared & Simplified
                  </span>
                </h1>
                <p className="mx-auto max-w-2xl text-slate-600 text-lg md:text-xl leading-relaxed fade-in-up">
                  Connect with top students and access high-quality notes from
                  your peers. Never scramble for notes during exam time again.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 slide-up-stagger">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 shadow-xl premium-hover glow-effect"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Join the Community
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="px-6 py-3 border-slate-200 hover:bg-slate-50 premium-hover glass-effect"
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Browse Notes
                </Button>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500 stats-counter">
                <div className="flex items-center space-x-2 premium-hover">
                  <Users className="h-4 w-4" />
                  <span>10,000+ Students</span>
                </div>
                <div className="flex items-center space-x-2 premium-hover">
                  <FileText className="h-4 w-4" />
                  <span>50,000+ Notes</span>
                </div>
                <div className="flex items-center space-x-2 premium-hover">
                  <Clock className="h-4 w-4" />
                  <span>24/7 Access</span>
                </div>
                <div className="flex items-center space-x-2 premium-hover">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>4.9/5 Rating</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Premium Smart Tools Section */}
        <section
          id="smart-tools"
          className="w-full py-16 bg-gradient-to-br from-slate-50 to-blue-50 relative"
        >
          <div className="container max-w-6xl mx-auto px-6">
            <div className="text-center space-y-4 mb-12 section-header">
              <Badge
                variant="secondary"
                className="px-3 py-1 text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200"
              >
                🔧 Smart Tools
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
                Powerful tools to{" "}
                <span className="premium-gradient-text">
                  enhance your notes
                </span>
              </h2>
              <p className="mx-auto max-w-2xl text-slate-600 text-lg">
                Advanced technology that makes note sharing and studying more
                efficient than ever
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3 stagger-animation">
              <Card className="group glass-card premium-hover border-0 bg-white/60 backdrop-blur-xl shadow-xl">
                <CardHeader className="text-center pb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <ScanText className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="group-hover:text-blue-600 transition-colors text-lg">
                    Handwritten to Text
                  </CardTitle>
                  <CardDescription className="text-sm text-slate-600">
                    Convert handwritten notes to searchable, editable text PDFs
                    with our advanced OCR technology.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="group glass-card premium-hover border-0 bg-white/60 backdrop-blur-xl shadow-xl">
                <CardHeader className="text-center pb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <FileSearch className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="group-hover:text-purple-600 transition-colors text-lg">
                    Smart Summaries
                  </CardTitle>
                  <CardDescription className="text-sm text-slate-600">
                    Get AI-generated summaries of lengthy notes to quickly grasp
                    key concepts and main points.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="group glass-card premium-hover border-0 bg-white/60 backdrop-blur-xl shadow-xl">
                <CardHeader className="text-center pb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <FolderOpen className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="group-hover:text-green-600 transition-colors text-lg">
                    Easy Organization
                  </CardTitle>
                  <CardDescription className="text-sm text-slate-600">
                    Automatically categorize and tag notes by subject,
                    professor, and topic for effortless discovery.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Premium Features Section */}
        <section id="features" className="w-full py-16 bg-white">
          <div className="container max-w-6xl mx-auto px-6">
            <div className="text-center space-y-4 mb-12 section-header">
              <Badge
                variant="secondary"
                className="px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
              >
                Core Features
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
                Everything you need to excel
              </h2>
              <p className="mx-auto max-w-2xl text-slate-600 text-lg">
                Never scramble for notes again with our comprehensive platform
                designed by students, for students
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 stagger-animation">
              <Card className="group premium-hover glass-card border border-slate-200/50 bg-white/80 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Upload className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-base">Easy Upload</CardTitle>
                  <CardDescription className="text-sm text-slate-600">
                    Upload your notes in seconds with automatic organization by
                    subject and date.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="group premium-hover glass-card border border-slate-200/50 bg-white/80 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Search className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-base">Smart Search</CardTitle>
                  <CardDescription className="text-sm text-slate-600">
                    Find exactly what you need instantly with advanced filters
                    and content search.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="group premium-hover glass-card border border-slate-200/50 bg-white/80 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Share2 className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-base">Collaborative</CardTitle>
                  <CardDescription className="text-sm text-slate-600">
                    Share notes with classmates and build a supportive learning
                    community.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="group premium-hover glass-card border border-slate-200/50 bg-white/80 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Download className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-base">Offline Access</CardTitle>
                  <CardDescription className="text-sm text-slate-600">
                    Download notes for offline studying during exam preparation.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="group premium-hover glass-card border border-slate-200/50 bg-white/80 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-base">Quality Control</CardTitle>
                  <CardDescription className="text-sm text-slate-600">
                    Community-driven rating system ensures high-quality notes
                    from top students.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="group premium-hover glass-card border border-slate-200/50 bg-white/80 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-base">Study Tools</CardTitle>
                  <CardDescription className="text-sm text-slate-600">
                    Built-in highlighting, bookmarking, and annotation tools for
                    better learning.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Premium How It Works Section */}
        <section
          id="how-it-works"
          className="w-full py-16 bg-gradient-to-br from-blue-50 to-purple-50"
        >
          <div className="container max-w-6xl mx-auto px-6">
            <div className="text-center space-y-4 mb-12 section-header">
              <Badge
                variant="secondary"
                className="px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
              >
                How It Works
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
                Get started in 3 simple steps
              </h2>
            </div>
            <div className="grid gap-8 md:grid-cols-3 stagger-animation">
              <div className="text-center space-y-4 group">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-xl font-bold text-white">1</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">Sign Up</h3>
                <p className="text-slate-600 text-sm">
                  Create your free account with your college email and join your
                  university community instantly.
                </p>
              </div>
              <div className="text-center space-y-4 group">
                <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-xl font-bold text-white">2</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Upload & Discover
                </h3>
                <p className="text-slate-600 text-sm">
                  Upload your notes to help others and discover high-quality
                  notes from top students in your courses.
                </p>
              </div>
              <div className="text-center space-y-4 group">
                <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-xl font-bold text-white">3</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Study & Excel
                </h3>
                <p className="text-slate-600 text-sm">
                  Access quality notes, use smart tools, and never scramble for
                  notes during exam time again.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Premium Pricing Section */}
        <section id="pricing" className="w-full py-16 bg-white">
          <div className="container max-w-5xl mx-auto px-6">
            <div className="text-center space-y-4 mb-12 section-header">
              <Badge
                variant="secondary"
                className="px-3 py-1 text-xs font-medium bg-green-50 text-green-700 border border-green-200"
              >
                Pricing
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
                Choose your learning journey
              </h2>
              <p className="mx-auto max-w-2xl text-slate-600 text-lg">
                Start free and upgrade as you grow. All plans include access to
                our note-sharing community.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3 stagger-animation">
              {/* Free Plan */}
              <Card className="pricing-card relative premium-hover glass-card border border-slate-200 bg-white/80 backdrop-blur-sm shadow-lg">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl">Free</CardTitle>
                  <div className="text-3xl font-bold text-slate-900 mt-2">
                    $0
                  </div>
                  <p className="text-slate-600 text-sm">
                    Perfect for getting started
                  </p>
                </CardHeader>
                <CardContent className="pricing-content">
                  <div className="pricing-features space-y-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">
                        Upload up to 10 notes/month
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">
                        Basic search functionality
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">Community access</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">Basic summaries (5/month)</span>
                    </div>
                  </div>
                  <div className="pricing-button">
                    <Link href="/signup" className="block">
                      <Button className="w-full text-sm py-2 premium-hover">
                        Get Started Free
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Pro Plan */}
              <Card className="pricing-card relative premium-hover glass-card border-2 border-blue-500 bg-white/90 backdrop-blur-sm shadow-xl scale-105">
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 text-xs">
                    Most Popular
                  </Badge>
                </div>
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl">Pro</CardTitle>
                  <div className="text-3xl font-bold text-blue-600 mt-2">
                    $9.99
                  </div>
                  <p className="text-slate-600 text-sm">per month</p>
                </CardHeader>
                <CardContent className="pricing-content">
                  <div className="pricing-features space-y-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">Unlimited note uploads</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">Advanced search & filters</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">Unlimited AI summaries</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">
                        Handwritten note conversion
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">Priority support</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">Offline downloads</span>
                    </div>
                  </div>
                  <div className="pricing-button">
                    <Link href="/signup" className="block">
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-sm py-2 premium-hover">
                        Start Pro Trial
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Premium Plan */}
              <Card className="pricing-card relative premium-hover glass-card border border-slate-200 bg-white/80 backdrop-blur-sm shadow-lg">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl">Premium</CardTitle>
                  <div className="text-3xl font-bold text-purple-600 mt-2">
                    $19.99
                  </div>
                  <p className="text-slate-600 text-sm">per month</p>
                </CardHeader>
                <CardContent className="pricing-content">
                  <div className="pricing-features space-y-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">Everything in Pro</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">
                        Early access to new features
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">
                        Advanced organization tools
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">Bulk upload capabilities</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">24/7 priority support</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">
                        Premium badge & recognition
                      </span>
                    </div>
                  </div>
                  <div className="pricing-button">
                    <Link href="/signup" className="block">
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-sm py-2 premium-hover">
                        Go Premium
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Premium Community Section */}
        <section
          id="community"
          className="w-full py-16 bg-gradient-to-br from-slate-50 to-blue-50"
        >
          <div className="container max-w-6xl mx-auto px-6">
            <div className="text-center space-y-4 mb-12 section-header">
              <Badge
                variant="secondary"
                className="px-3 py-1 text-xs font-medium bg-green-50 text-green-700 border border-green-200"
              >
                Community
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
                Loved by students everywhere
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3 stagger-animation">
              <Card className="premium-hover glass-card border border-white/20 bg-white/60 backdrop-blur-xl shadow-lg">
                <CardContent className="p-5">
                  <div className="flex items-center space-x-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-3 w-3 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-slate-600 mb-3 text-sm">
                    "Found amazing notes from seniors just before my finals.
                    CollegeBuddy literally saved my semester!"
                  </p>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        S
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Sarah Chen</p>
                      <p className="text-xs text-slate-500">
                        Computer Science, MIT
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="premium-hover glass-card border border-white/20 bg-white/60 backdrop-blur-xl shadow-lg">
                <CardContent className="p-5">
                  <div className="flex items-center space-x-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-3 w-3 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-slate-600 mb-3 text-sm">
                    "The handwritten note conversion is incredible! Now I can
                    search through all my notes instantly."
                  </p>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        M
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Marcus Johnson</p>
                      <p className="text-xs text-slate-500">
                        Business, Stanford
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="premium-hover glass-card border border-white/20 bg-white/60 backdrop-blur-xl shadow-lg">
                <CardContent className="p-5">
                  <div className="flex items-center space-x-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-3 w-3 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-slate-600 mb-3 text-sm">
                    "No more panic before exams! I always know I can find
                    quality notes from my classmates here."
                  </p>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        E
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Emily Rodriguez</p>
                      <p className="text-xs text-slate-500">Pre-Med, Harvard</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Premium CTA Section */}
        <section className="w-full py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10" />
          <div className="container max-w-4xl mx-auto px-6 relative">
            <div className="text-center space-y-6 cta-content">
              <div className="space-y-3">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                  Never scramble for notes again
                </h2>
                <p className="mx-auto max-w-2xl text-blue-100 text-lg">
                  Join thousands of students who always have access to quality
                  notes from their peers, especially when exams are around the
                  corner.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/signup">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 shadow-xl premium-hover glow-effect"
                  >
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Find Your Notes Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-blue-100">
                No credit card required • Free forever plan available
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Premium Footer */}
      <footer className="w-full py-12 bg-slate-900 text-white">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-7 h-7 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                  <GraduationCap className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-bold">CollegeBuddy</span>
              </Link>
              <p className="text-slate-400 text-sm">
                Empowering students to learn together through seamless note
                sharing and smart organization tools.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Product</h4>
              <div className="space-y-2 text-slate-400">
                <Link
                  href="#features"
                  className="block hover:text-white transition-colors text-sm"
                >
                  Features
                </Link>
                <Link
                  href="#smart-tools"
                  className="block hover:text-white transition-colors text-sm"
                >
                  Smart Tools
                </Link>
                <Link
                  href="#pricing"
                  className="block hover:text-white transition-colors text-sm"
                >
                  Pricing
                </Link>
                <Link
                  href="#"
                  className="block hover:text-white transition-colors text-sm"
                >
                  API
                </Link>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Company</h4>
              <div className="space-y-2 text-slate-400">
                <Link
                  href="#"
                  className="block hover:text-white transition-colors text-sm"
                >
                  About
                </Link>
                <Link
                  href="#"
                  className="block hover:text-white transition-colors text-sm"
                >
                  Blog
                </Link>
                <Link
                  href="#"
                  className="block hover:text-white transition-colors text-sm"
                >
                  Careers
                </Link>
                <Link
                  href="#"
                  className="block hover:text-white transition-colors text-sm"
                >
                  Press
                </Link>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Support</h4>
              <div className="space-y-2 text-slate-400">
                <Link
                  href="#"
                  className="block hover:text-white transition-colors text-sm"
                >
                  Help Center
                </Link>
                <Link
                  href="#"
                  className="block hover:text-white transition-colors text-sm"
                >
                  Contact
                </Link>
                <Link
                  href="#"
                  className="block hover:text-white transition-colors text-sm"
                >
                  Privacy
                </Link>
                <Link
                  href="#"
                  className="block hover:text-white transition-colors text-sm"
                >
                  Terms
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} CollegeBuddy. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
