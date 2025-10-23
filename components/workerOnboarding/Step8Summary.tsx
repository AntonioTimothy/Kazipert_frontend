"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Briefcase, User, IdCard } from "lucide-react"

interface Step8SummaryProps {
  data: any
  user: any
  router: any
}

export default function Step8Summary({ data, user, router }: Step8SummaryProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border-2 p-4 border-theme-success/30 bg-theme-success/5">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-theme-success mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-theme-success mb-1">Application Complete! 🎉</h3>
            <p className="text-theme-text-muted text-sm">
              Your profile is now ready for verification. Here's a summary of your application.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Personal Information */}
        <Card className="bg-theme-background border-theme-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-theme-text">
              <User className="h-4 w-4 text-theme-primary" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-theme-text-muted">Full Name:</span>
              <span className="font-medium text-theme-text">{user.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-theme-text-muted">Date of Birth:</span>
              <span className="font-medium text-theme-text">{data.personalInfo.dateOfBirth || "Not provided"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-theme-text-muted">County:</span>
              <span className="font-medium text-theme-text">{data.personalInfo.county || "Not selected"}</span>
            </div>
          </CardContent>
        </Card>

        {/* KYC Details */}
        <Card className="bg-theme-background border-theme-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-theme-text">
              <IdCard className="h-4 w-4 text-theme-primary" />
              KYC Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-theme-text-muted">ID Number:</span>
              <span className="font-medium text-theme-text">{data.kycDetails.idNumber || "Not provided"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-theme-text-muted">Work Experience:</span>
              <span className="font-medium text-theme-text">{data.kycDetails.workExperience || "Not specified"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-theme-text-muted">Skills:</span>
              <span className="font-medium text-theme-text">{data.kycDetails.skills.length} selected</span>
            </div>
          </CardContent>
        </Card>

        {/* Verification Status */}
        <Card className="bg-theme-background border-theme-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-theme-text">Verification Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-theme-text">Face Verification</span>
              <Badge variant={data.verification.faceVerified ? "default" : "secondary"}>
                {data.verification.faceVerified ? "Verified" : "Pending"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-theme-text">Documents</span>
              <Badge variant={
                data.documents.profilePicture &&
                  data.documents.idDocumentFront &&
                  data.documents.idDocumentBack
                  ? "default"
                  : "secondary"
              }>
                {data.documents.profilePicture &&
                  data.documents.idDocumentFront &&
                  data.documents.idDocumentBack
                  ? "Uploaded"
                  : "Incomplete"
                }
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-theme-text">Payment Status</span>
              <Badge variant={data.verification.paymentVerified ? "default" : "secondary"}>
                {data.verification.paymentVerified ? "Paid" : "Pending"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Next Steps */}
      <Card className="bg-theme-background border-theme-border">
        <CardHeader>
          <CardTitle className="text-sm text-theme-text">What Happens Next?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 text-sm">
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-theme-primary/10 border border-theme-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-theme-primary">1</span>
              </div>
              <div>
                <span className="font-medium text-theme-text">Document Verification</span>
                <p className="text-theme-text-muted">Our team will verify your documents within 24-48 hours</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-theme-primary/10 border border-theme-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-theme-primary">2</span>
              </div>
              <div>
                <span className="font-medium text-theme-text">Profile Activation</span>
                <p className="text-theme-text-muted">Once verified, your profile will be activated for job matching</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-theme-primary/10 border border-theme-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-theme-primary">3</span>
              </div>
              <div>
                <span className="font-medium text-theme-text">Job Matching</span>
                <p className="text-theme-text-muted">We'll match you with suitable international employers</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button
          onClick={() => router.push('/worker/jobs')}
          className="flex-1 text-white font-semibold text-base py-2.5 bg-theme-primary"
        >
          <Briefcase className="h-5 w-5 mr-2" />
          Browse Available Jobs
        </Button>
        <Button
          onClick={() => router.push('/worker/dashboard')}
          variant="outline"
          className="border-theme-border hover:bg-theme-primary/10"
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  )
}