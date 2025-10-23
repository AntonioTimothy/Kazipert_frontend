import { NextRequest, NextResponse } from 'next/server'
import { saveOnboardingProgress, fetchOnboardingProgress } from '@/lib/onboarding-service'

export async function POST(request: NextRequest) {
    try {
        const { userId, currentStep, data } = await request.json()

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
        }

        const result = await saveOnboardingProgress(userId, currentStep, data)

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Progress save error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId')

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
        }

        const progress = await fetchOnboardingProgress(userId)

        if (!progress) {
            return NextResponse.json({ error: 'Progress not found' }, { status: 404 })
        }

        return NextResponse.json(progress)
    } catch (error) {
        console.error('Progress fetch error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}