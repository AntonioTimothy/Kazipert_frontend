"use client"

// app/worker/onboarding/page.tsx
import { redirect } from 'next/navigation'
import WorkerOnboardingClient from './WorkerOnboardingClient'
import { fetchOnboardingProgress } from '@/lib/onboarding-service'
import { getCurrentUser } from '@/lib/auth'
import { useEffect, useState } from "react"
import { WorkerProfile } from '@/lib/mock-data'
import { useRouter } from "next/navigation"

export default async function WorkerOnboardingPage() {
  // Get the current authenticated user using the enhanced auth system
  const router = useRouter()

    const [user, setUser] = useState<WorkerProfile | null>(null)
    const [showProfilePrompt, setShowProfilePrompt] = useState(false)
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
      
      // Show profile prompt if profile completion is low
      const completion = calculateProfileCompletion(parsedUser)
      if (completion < 70) {
        setShowProfilePrompt(true)
      }
      
      setLoading(false)
    }, [router])

    const calculateProfileCompletion = (user: WorkerProfile) => {
      return Math.round(
        ((user.documents.passport ? 1 : 0) +
          (user.documents.certificate ? 1 : 0) +
          (user.documents.medicalReport ? 1 : 0) +
          (user.subscriptions.insurance ? 1 : 0) +
          (user.subscriptions.legal ? 1 : 0) +
          (user.subscriptions.medical ? 1 : 0)) *
          (100 / 6),
      )
    }
  
  
  

  // Fetch initial progress from database using the actual user ID
  const progressData = await fetchOnboardingProgress(user?.id)
  
  return (
    <WorkerOnboardingClient 
      initialUser={user}
      initialProgress={progressData}
    />
  )
}