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
  Shield,
  Video,
  MessageSquare,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  Wallet,
  Send,
  Receipt,
  AlertTriangle,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import type { WorkerProfile } from "@/lib/mock-data"
import { mockJobs, mockContracts } from "@/lib/mock-data"

export default function WorkerDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<WorkerProfile | null>(null)
  const [loading, setLoading] = useState(true)

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

  const navigation = [
    { name: "Home", href: "/worker/dashboard", icon: Home },
    { name: "My Profile", href: "/worker/profile", icon: User },
    { name: "Find Jobs", href: "/worker/jobs", icon: Briefcase },
    { name: "My Contracts", href: "/worker/contracts", icon: FileText },
    { name: "Payslips", href: "/worker/payslips", icon: Receipt },
    { name: "Payment History", href: "/worker/payment-history", icon: DollarSign },
    { name: "Subscriptions", href: "/worker/subscriptions", icon: Shield },
    { name: "Payment Cards", href: "/worker/payment-cards", icon: CreditCard },
    { name: "Training", href: "/worker/training", icon: Video },
    { name: "Report Issue", href: "/worker/report-issue", icon: AlertTriangle },
    { name: "Reviews", href: "/worker/reviews", icon: MessageSquare },
  ]

  const userContract = mockContracts.find((c) => c.workerId === user.id)

  const profileCompletion = Math.round(
    ((user.documents.passport ? 1 : 0) +
      (user.documents.certificate ? 1 : 0) +
      (user.documents.medicalReport ? 1 : 0) +
      (user.subscriptions.insurance ? 1 : 0) +
      (user.subscriptions.legal ? 1 : 0) +
      (user.subscriptions.medical ? 1 : 0)) *
      (100 / 6),
  )

  return (
    <PortalLayout navigation={navigation} user={user}>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              Welcome back, {user.name.split(" ")[0]}!
              <svg width="24" height="24" viewBox="0 0 100 100" className="animate-pulse">
                <polygon points="50,10 90,90 10,90" fill="hsl(var(--accent))" />
              </svg>
            </h1>
            <p className="text-muted-foreground">Here's your employment journey overview</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button asChild className="bg-accent hover:bg-accent/90">
              <Link href="/worker/payment-history">
                <Wallet className="mr-2 h-4 w-4" />
                View Balance
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-accent/30 hover:bg-accent/10 bg-transparent">
              <Link href="/worker/payment-history?action=withdraw">
                <Send className="mr-2 h-4 w-4" />
                Withdraw to M-Pesa
              </Link>
            </Button>
          </div>
        </div>

        {/* KYC Status Alert */}
        {user.kycStatus === "pending" && (
          <Card className="border-accent bg-accent/5">
            <CardContent className="flex items-center gap-4 pt-6">
              <AlertCircle className="h-8 w-8 text-accent" />
              <div className="flex-1">
                <h3 className="font-semibold">KYC Verification Pending</h3>
                <p className="text-sm text-muted-foreground">
                  Your account is under review. This usually takes 24-48 hours.
                </p>
              </div>
              <Button variant="outline">View Status</Button>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Profile Completion</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profileCompletion}%</div>
              <Progress value={profileCompletion} className="mt-2" />
              <p className="mt-2 text-xs text-muted-foreground">Complete your profile to get matched</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Applications</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userContract ? 1 : 0}</div>
              <p className="mt-2 text-xs text-muted-foreground">
                {userContract ? "Contract in progress" : "No active applications"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Available Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockJobs.filter((j) => j.status === "open").length}</div>
              <p className="mt-2 text-xs text-muted-foreground">Matching your skills</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Next Payment</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userContract ? userContract.salary : "$0"}</div>
              <p className="mt-2 text-xs text-muted-foreground">
                {userContract ? "Expected on 1st of month" : "No active contract"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Current Contract */}
          <Card>
            <CardHeader>
              <CardTitle>Current Contract</CardTitle>
              <CardDescription>Your active employment contract</CardDescription>
            </CardHeader>
            <CardContent>
              {userContract ? (
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{userContract.jobTitle}</h3>
                      <p className="text-sm text-muted-foreground">{userContract.employerName}</p>
                    </div>
                    <Badge variant={userContract.status === "signed" ? "default" : "secondary"}>
                      {userContract.status}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Salary:</span>
                      <span className="font-medium">{userContract.salary}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium">{userContract.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Start Date:</span>
                      <span className="font-medium">{userContract.startDate}</span>
                    </div>
                  </div>

                  <Button className="w-full" asChild>
                    <Link href="/worker/contracts">View Contract Details</Link>
                  </Button>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Briefcase className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 font-semibold">No Active Contract</h3>
                  <p className="mt-2 text-sm text-muted-foreground">Start browsing jobs to find your perfect match</p>
                  <Button className="mt-4" asChild>
                    <Link href="/worker/jobs">Browse Jobs</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Subscriptions */}
          <Card>
            <CardHeader>
              <CardTitle>My Subscriptions</CardTitle>
              <CardDescription>Active services and coverage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">Insurance</div>
                      <div className="text-xs text-muted-foreground">Health & Travel Coverage</div>
                    </div>
                  </div>
                  <Badge variant={user.subscriptions.insurance ? "default" : "secondary"}>
                    {user.subscriptions.insurance ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10">
                      <FileText className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <div className="font-medium">Legal Service</div>
                      <div className="text-xs text-muted-foreground">Contract & Legal Support</div>
                    </div>
                  </div>
                  <Badge variant={user.subscriptions.legal ? "default" : "secondary"}>
                    {user.subscriptions.legal ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                      <Shield className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <div className="font-medium">Medical Cover</div>
                      <div className="text-xs text-muted-foreground">Health Examinations</div>
                    </div>
                  </div>
                  <Badge variant={user.subscriptions.medical ? "default" : "secondary"}>
                    {user.subscriptions.medical ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="/worker/services">Manage Subscriptions</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommended Jobs */}
        <Card>
          <CardHeader>
            <CardTitle>Recommended Jobs</CardTitle>
            <CardDescription>Jobs matching your skills and preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockJobs.slice(0, 3).map((job) => (
                <div key={job.id} className="flex items-start justify-between rounded-lg border border-border p-4">
                  <div className="flex-1">
                    <h3 className="font-semibold">{job.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {job.employerName} • {job.location}, {job.country}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant="secondary">{job.salary}</Badge>
                      <Badge variant="outline">{job.status}</Badge>
                    </div>
                  </div>
                  <Button size="sm" asChild>
                    <Link href={`/worker/jobs/${job.id}`}>View Details</Link>
                  </Button>
                </div>
              ))}

              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/worker/jobs">View All Jobs</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-accent/30 bg-gradient-to-br from-accent/5 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Quick Actions
              <svg width="20" height="20" viewBox="0 0 100 100" className="animate-pulse">
                <polygon points="50,10 90,90 10,90" fill="hsl(var(--accent))" />
              </svg>
            </CardTitle>
            <CardDescription>Frequently used features for quick access</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Button
                asChild
                variant="outline"
                className="h-auto flex-col gap-2 py-4 hover:bg-accent/10 bg-transparent"
              >
                <Link href="/worker/payslips">
                  <Receipt className="h-6 w-6 text-primary" />
                  <span className="text-sm font-medium">View Payslips</span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-auto flex-col gap-2 py-4 hover:bg-accent/10 bg-transparent"
              >
                <Link href="/worker/payment-history?action=withdraw">
                  <Send className="h-6 w-6 text-accent" />
                  <span className="text-sm font-medium">Send to M-Pesa</span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-auto flex-col gap-2 py-4 hover:bg-accent/10 bg-transparent"
              >
                <Link href="/worker/report-issue">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                  <span className="text-sm font-medium">Report Issue</span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-auto flex-col gap-2 py-4 hover:bg-accent/10 bg-transparent"
              >
                <Link href="/worker/subscriptions">
                  <Shield className="h-6 w-6 text-secondary" />
                  <span className="text-sm font-medium">Manage Services</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  )
}
