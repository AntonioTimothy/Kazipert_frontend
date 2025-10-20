// app/api/onboarding/face-verification/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const { userId, studioName, studioLocation, photos, faceMatchScore } = await request.json();

        // Simulate face recognition - in production, integrate with CompreFace
        const verified = faceMatchScore > 80; // Temporary simulation

        const session = await prisma.studioSession.upsert({
            where: { userId },
            update: {
                studioName,
                studioLocation,
                photos,
                faceMatchScore,
                verified
            },
            create: {
                userId,
                studioName,
                studioLocation,
                photos,
                faceMatchScore,
                verified
            }
        });

        // Update KYC with face verification status
        if (verified) {
            await prisma.kycDetails.upsert({
                where: { userId },
                update: { faceVerified: true },
                create: {
                    userId,
                    faceVerified: true
                }
            });
        }

        // Update onboarding progress
        await prisma.onboardingProgress.upsert({
            where: { userId },
            update: {
                currentStep: 5, // Move to medical step
                steps: {
                    personalInfo: true,
                    kycDetails: true,
                    documents: true,
                    studio: true
                }
            },
            create: {
                userId,
                currentStep: 5,
                steps: {
                    personalInfo: true,
                    kycDetails: true,
                    documents: true,
                    studio: true
                }
            }
        });

        return NextResponse.json({
            session,
            verified,
            message: verified ? 'Face verification successful' : 'Face verification failed'
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}