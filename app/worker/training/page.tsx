"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PortalLayout } from "@/components/portal-layout"
import { LoadingSpinner } from "@/components/loading-spinner"
import {
  Home,
  User,
  Briefcase,
  FileText,
  CreditCard,
  MessageSquare,
  Video,
  BookOpen,
  Award,
  PlayCircle,
  CheckCircle,
  Lock,
  Clock,
  Star,
  Download,
  Share2,
  Shield,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import Link from "next/link"
import type { WorkerProfile } from "@/lib/mock-data"

interface Course {
  id: string
  title: string
  description: string
  duration: string
  lessons: number
  progress: number
  status: "locked" | "in-progress" | "completed"
  category: string
  instructor: string
  rating: number
  students: number
}

const courses: Course[] = [
  {
    id: "1",
    title: "Introduction to Gulf Culture & Customs",
    description: "Learn about cultural norms, traditions, and etiquette in Gulf countries",
    duration: "2 hours",
    lessons: 8,
    progress: 100,
    status: "completed",
    category: "Culture",
    instructor: "Dr. Fatima Al-Rashid",
    rating: 4.8,
    students: 1250,
  },
  {
    id: "2",
    title: "Arabic Language Basics for Workers",
    description: "Essential Arabic phrases and communication skills for daily work",
    duration: "4 hours",
    lessons: 12,
    progress: 65,
    status: "in-progress",
    category: "Language",
    instructor: "Ahmed Hassan",
    rating: 4.9,
    students: 980,
  },
  {
    id: "3",
    title: "Professional Housekeeping Standards",
    description: "Master modern housekeeping techniques and international standards",
    duration: "3 hours",
    lessons: 10,
    progress: 30,
    status: "in-progress",
    category: "Skills",
    instructor: "Mary Johnson",
    rating: 4.7,
    students: 1100,
  },
  {
    id: "4",
    title: "Child Care & Safety",
    description: "Professional childcare practices, safety protocols, and emergency response",
    duration: "3.5 hours",
    lessons: 11,
    progress: 0,
    status: "locked",
    category: "Skills",
    instructor: "Sarah Williams",
    rating: 4.9,
    students: 850,
  },
  {
    id: "5",
    title: "Cooking International Cuisines",
    description: "Learn to prepare Middle Eastern, Asian, and Western dishes",
    duration: "5 hours",
    lessons: 15,
    progress: 0,
    status: "locked",
    category: "Skills",
    instructor: "Chef Omar Abdullah",
    rating: 4.8,
    students: 720,
  },
  {
    id: "6",
    title: "Your Rights & Legal Protection",
    description: "Understanding your employment rights, contracts, and legal protections",
    duration: "2.5 hours",
    lessons: 9,
    progress: 100,
    status: "completed",
    category: "Legal",
    instructor: "Advocate Jane Mwangi",
    rating: 5.0,
    students: 1500,
  },
]

export default function WorkerTrainingPage() {
  const router = useRouter()
  const [user, setUser] = useState<WorkerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  useEffect(() => {
    const userData = sessionStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "worker") {
      router.push("/login")
      return
    }

    setUser(parsedUser)
    setLoading(false)
  }, [router])

  if (loading || !user) {
    return <LoadingSpinner />
  }

  const navigationdhdhd = [
    { name: "Home", href: "/worker/dashboard", icon: Home },
    { name: "My Profile", href: "/worker/profile", icon: User },
    { name: "Find Jobs", href: "/worker/jobs", icon: Briefcase },
    { name: "My Contracts", href: "/worker/contracts", icon: FileText },
    { name: "Payments", href: "/worker/payments", icon: CreditCard },
    { name: "Training", href: "/worker/training", icon: Video },
    { name: "Messages", href: "/worker/messages", icon: MessageSquare },
  ]

  const navigation = [
    { name: "Dashboard", href: "/worker/dashboard", icon: Home },
    
    { name: "Find Jobs", href: "/worker/jobs", icon: Briefcase },
    { name: "My Applications", href: "/worker/contracts", icon: FileText },
    { name: "Wallet", href: "/worker/payments", icon: CreditCard },
    { name: "Services", href: "/worker/services", icon: Shield },
    { name: "Training", href: "/worker/training", icon: Video },
    { name: "Reviews", href: "/worker/reviews", icon: Star },

    { name: "Support", href: "/worker/support", icon: MessageSquare },
  ]


  const completedCourses = courses.filter((c) => c.status === "completed").length
  const inProgressCourses = courses.filter((c) => c.status === "in-progress").length
  const totalProgress = Math.round(courses.reduce((acc, c) => acc + c.progress, 0) / courses.length)

  const categories = ["all", "Culture", "Language", "Skills", "Legal"]
  const filteredCourses = selectedCategory === "all" ? courses : courses.filter((c) => c.category === selectedCategory)

  return (
    <PortalLayout navigation={navigation} user={user}>
      <div className="space-y-6">
        {/* Header with animated triangle */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              Training Center
              <svg width="24" height="24" viewBox="0 0 100 100" className="animate-pulse">
                <polygon points="50,10 90,90 10,90" fill="hsl(var(--accent))" />
              </svg>
            </h1>
            <p className="text-muted-foreground">Enhance your skills and boost your career</p>
          </div>
          <Button asChild className="bg-accent hover:bg-accent/90">
            <Link href="/worker/certificates">
              <Award className="mr-2 h-4 w-4" />
              My Certificates
            </Link>
          </Button>
        </div>

        {/* Progress Overview */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completed Courses</CardTitle>
              <CheckCircle className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedCourses}</div>
              <p className="mt-2 text-xs text-muted-foreground">Certificates earned</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inProgressCourses}</div>
              <p className="mt-2 text-xs text-muted-foreground">Currently learning</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-secondary/20 bg-gradient-to-br from-secondary/5 to-transparent">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
              <BookOpen className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProgress}%</div>
              <Progress value={totalProgress} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Featured Course Banner */}
        <Card className="border-2 border-accent/30 bg-gradient-to-r from-accent/10 via-primary/5 to-secondary/10 overflow-hidden relative">
          <div className="absolute top-0 right-0 opacity-10">
            <svg width="200" height="200" viewBox="0 0 100 100">
              <polygon points="50,10 90,90 10,90" fill="hsl(var(--accent))" />
            </svg>
          </div>
          <CardContent className="pt-6 relative z-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex-1">
                <Badge className="mb-2 bg-accent">Featured Course</Badge>
                <h3 className="text-2xl font-bold mb-2">Arabic Language Basics for Workers</h3>
                <p className="text-muted-foreground mb-4">
                  Continue your journey to master essential Arabic phrases for daily work communication
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    4.9 rating
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />4 hours
                  </span>
                  <span>65% complete</span>
                </div>
              </div>
              <Button size="lg" className="bg-accent hover:bg-accent/90">
                <PlayCircle className="mr-2 h-5 w-5" />
                Continue Learning
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Category Filter */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="capitalize">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory} className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              {filteredCourses.map((course) => (
                <Card
                  key={course.id}
                  className={`transition-all hover:border-primary/50 ${course.status === "locked" ? "opacity-60" : ""}`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{course.category}</Badge>
                          {course.status === "completed" && (
                            <Badge className="bg-primary">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Completed
                            </Badge>
                          )}
                          {course.status === "in-progress" && (
                            <Badge className="bg-accent">
                              <Clock className="mr-1 h-3 w-3" />
                              In Progress
                            </Badge>
                          )}
                          {course.status === "locked" && (
                            <Badge variant="secondary">
                              <Lock className="mr-1 h-3 w-3" />
                              Locked
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                      </div>
                    </div>
                    <CardDescription>{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Course Stats */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {course.lessons} lessons
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {course.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-accent text-accent" />
                        {course.rating}
                      </span>
                    </div>

                    {/* Instructor */}
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {course.instructor.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium">{course.instructor}</div>
                        <div className="text-xs text-muted-foreground">{course.students} students</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {course.status !== "locked" && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} />
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {course.status === "locked" ? (
                        <Button className="flex-1" disabled>
                          <Lock className="mr-2 h-4 w-4" />
                          Complete Previous Courses
                        </Button>
                      ) : course.status === "completed" ? (
                        <>
                          <Button className="flex-1 bg-transparent" variant="outline" className="bg-transparent">
                            <PlayCircle className="mr-2 h-4 w-4" />
                            Review Course
                          </Button>
                          <Button variant="outline" className="bg-transparent">
                            <Download className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button className="flex-1 bg-accent hover:bg-accent/90">
                            <PlayCircle className="mr-2 h-4 w-4" />
                            {course.progress > 0 ? "Continue" : "Start Course"}
                          </Button>
                          <Button variant="outline" className="bg-transparent">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Learning Path Illustration */}
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 overflow-hidden relative">
          <div className="absolute inset-0 opacity-5">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="triangles" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                  <polygon points="50,10 90,90 10,90" fill="hsl(var(--accent))" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#triangles)" />
            </svg>
          </div>
          <CardContent className="pt-6 relative z-10">
            <div className="text-center max-w-2xl mx-auto">
              <Award className="h-16 w-16 mx-auto mb-4 text-accent" />
              <h3 className="text-2xl font-bold mb-2">Your Learning Journey</h3>
              <p className="text-muted-foreground mb-6">
                Complete all courses to earn your Professional Worker Certificate and increase your chances of getting
                hired by top employers
              </p>
              <div className="flex items-center justify-center gap-8 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{completedCourses}</div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
                <div className="h-12 w-px bg-border" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent">{inProgressCourses}</div>
                  <div className="text-sm text-muted-foreground">In Progress</div>
                </div>
                <div className="h-12 w-px bg-border" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary">
                    {courses.length - completedCourses - inProgressCourses}
                  </div>
                  <div className="text-sm text-muted-foreground">Remaining</div>
                </div>
              </div>
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <Award className="mr-2 h-5 w-5" />
                View Certificate Requirements
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  )
}
