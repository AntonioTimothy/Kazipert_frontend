"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PortalLayout } from "@/components/portal-layout"
import {
  Home,
  User,
  Briefcase,
  FileText,
  CreditCard,
  Shield,
  Video,
  MessageSquare,
  MapPin,
  DollarSign,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import type { WorkerProfile } from "@/lib/mock-data"
import { mockJobs } from "@/lib/mock-data"

export default function WorkerJobsPage() {
  const router = useRouter()
  const [user, setUser] = useState<WorkerProfile | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

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
  }, [router])

  if (!user) {
    return <div>Loading...</div>
  }

  const navigation = [
    { name: "Dashboard", href: "/worker/dashboard", icon: Home },
    { name: "My Profile", href: "/worker/profile", icon: User },
    { name: "Find Jobs", href: "/worker/jobs", icon: Briefcase },
    { name: "My Contracts", href: "/worker/contracts", icon: FileText },
    { name: "Payments", href: "/worker/payments", icon: CreditCard },
    { name: "Services", href: "/worker/services", icon: Shield },
    { name: "Training", href: "/worker/training", icon: Video },
    { name: "Support", href: "/worker/support", icon: MessageSquare },
  ]

  const filteredJobs = mockJobs.filter(
    (job) =>
      job.status === "open" &&
      (job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.employerName.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <PortalLayout navigation={navigation} user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Find Jobs</h1>
          <p className="text-muted-foreground">Browse available opportunities matching your skills</p>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <Input
              placeholder="Search by job title, location, or employer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </CardContent>
        </Card>

        {/* Jobs List */}
        <div className="grid gap-6">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="transition-all hover:border-primary/50 hover:shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{job.title}</CardTitle>
                    <CardDescription className="mt-1">{job.employerName}</CardDescription>
                  </div>
                  <Badge>{job.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-relaxed text-muted-foreground">{job.description}</p>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {job.location}, {job.country}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>{job.salary}</span>
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-semibold">Requirements:</h4>
                  <div className="flex flex-wrap gap-2">
                    {job.requirements.map((req, index) => (
                      <Badge key={index} variant="secondary">
                        {req}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-semibold">Benefits:</h4>
                  <ul className="grid gap-1 text-sm text-muted-foreground md:grid-cols-2">
                    {job.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button className="flex-1">Apply Now</Button>
                  <Button variant="outline">Save Job</Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredJobs.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Briefcase className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 font-semibold">No jobs found</h3>
                <p className="mt-2 text-sm text-muted-foreground">Try adjusting your search criteria</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PortalLayout>
  )
}
