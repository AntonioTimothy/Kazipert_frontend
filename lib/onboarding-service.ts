import { prisma } from "@/lib/prisma"

export async function fetchOnboardingProgress(userId: string) {
    try {
        const progress = await prisma.onboardingProgress.findUnique({
            where: { userId },
            include: {
                kycDetails: true
            }
        })

        if (!progress) {
            // Create initial progress record
            return await prisma.onboardingProgress.create({
                data: {
                    userId,
                    currentStep: 1,
                    completed: false,
                    steps: {}
                },
                include: {
                    kycDetails: true
                }
            })
        }

        return progress
    } catch (error) {
        console.error('Failed to fetch onboarding progress:', error)
        return null
    }
}

export async function saveOnboardingProgress(userId: string, currentStep: number, data: any) {
    try {
        await prisma.onboardingProgress.upsert({
            where: { userId },
            update: {
                currentStep,
                steps: data
            },
            create: {
                userId,
                currentStep,
                steps: data
            }
        })

        // Also update KYC details if provided
        if (data.kycDetails) {
            await prisma.kycDetails.upsert({
                where: { userId },
                update: data.kycDetails,
                create: {
                    userId,
                    ...data.kycDetails
                }
            })
        }

        return { success: true }
    } catch (error) {
        console.error('Failed to save onboarding progress:', error)
        return { success: false, error: 'Failed to save progress' }
    }
}