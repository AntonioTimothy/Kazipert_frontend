// app/api/onboarding/progress/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        const progress = await prisma.onboardingProgress.findUnique({
            where: { userId },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        phone: true,
                        role: true
                    }
                }
            }
        });

        return NextResponse.json({ progress });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { userId, currentStep, completed, steps } = await request.json();

        const progress = await prisma.onboardingProgress.upsert({
            where: { userId },
            update: {
                currentStep,
                completed,
                steps: steps || undefined
            },
            create: {
                userId,
                currentStep,
                completed,
                steps: steps || {}
            }
        });

        return NextResponse.json({ progress });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}