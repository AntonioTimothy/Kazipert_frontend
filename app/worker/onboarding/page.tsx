import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import WorkerOnboardingClient from './WorkerOnboardingClient'
import { fetchOnboardingProgress } from '@/lib/onboarding-service'

export default async function WorkerOnboardingPage() {
  const session = await getServerSession()
  
  if (!session?.user) {
    redirect('/login')
  }

  // Fetch initial progress from database
  const progressData = await fetchOnboardingProgress(session.user.id)
  
  return (
    <WorkerOnboardingClient 
      initialUser={session.user}
      initialProgress={progressData}
    />
  )
}