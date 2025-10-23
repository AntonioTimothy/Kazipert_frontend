// app/worker/onboarding/page.tsx
import { redirect } from 'next/navigation'
import WorkerOnboardingClient from './WorkerOnboardingClient'
import { fetchOnboardingProgress } from '@/lib/onboarding-service'
import { getCurrentUser } from '@/lib/auth'

export default async function WorkerOnboardingPage() {
  // Get the current authenticated user using the enhanced auth system
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }

  // Fetch initial progress from database using the actual user ID
  const progressData = await fetchOnboardingProgress(user.id)
  
  return (
    <WorkerOnboardingClient 
      initialUser={user}
      initialProgress={progressData}
    />
  )
}