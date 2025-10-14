import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const { email, otp } = await request.json();

        if (!email || !otp) {
            return NextResponse.json(
                { error: 'Email and OTP are required' },
                { status: 400 }
            );
        }

        console.log(`Verifying email OTP: ${otp} for email: ${email}`);

        // Find valid OTP
        const otpRecord = await prisma.otpVerification.findFirst({
            where: {
                email,
                otp,
                type: 'EMAIL',
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
            console.log('Invalid or expired OTP record');
            return NextResponse.json(
                { error: 'Invalid or expired verification code' },
                { status: 400 }
            );
        }

        console.log('OTP record found, marking as verified');

        // Mark OTP as verified
        await prisma.otpVerification.update({
            where: { id: otpRecord.id },
            data: { verified: true }
        });

        // Check if user exists with this email and update if they do
        // If not, that's okay - we'll update during signup
        try {
            const existingUser = await prisma.user.findUnique({
                where: { email }
            });

            if (existingUser) {
                console.log('Updating existing user email verification');
                await prisma.user.update({
                    where: { email },
                    data: { emailVerified: true }
                });
            } else {
                console.log('No user found with this email - will be updated during signup');
            }
        } catch (userError) {
            console.log('User update not required or user not found yet');
            // It's okay if user doesn't exist yet - we'll handle during signup
        }

        return NextResponse.json(
            { message: 'Email verified successfully' },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Verify email OTP error:', error);
        return NextResponse.json(
            { error: 'Verification failed: ' + error.message },
            { status: 500 }
        );
    }
}