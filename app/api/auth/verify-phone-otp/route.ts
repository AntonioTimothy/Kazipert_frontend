import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const { phone, otp } = await request.json();

        if (!phone || !otp) {
            return NextResponse.json(
                { error: 'Phone number and OTP are required' },
                { status: 400 }
            );
        }

        // Find valid OTP
        const otpRecord = await prisma.otpVerification.findFirst({
            where: {
                phone,
                otp,
                type: 'PHONE',
                expiresAt: {
                    gt: new Date()
                },
                verified: false
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        if (!otpRecord) {
            return NextResponse.json(
                { error: 'Invalid or expired verification code' },
                { status: 400 }
            );
        }

        // Mark OTP as verified
        await prisma.otpVerification.update({
            where: { id: otpRecord.id },
            data: { verified: true }
        });

        // Update user phone verification status
        await prisma.user.update({
            where: { phone },
            data: { phoneVerified: true }
        });

        return NextResponse.json(
            { message: 'Phone number verified successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Verify phone OTP error:', error);
        return NextResponse.json(
            { error: 'Verification failed' },
            { status: 500 }
        );
    }
}