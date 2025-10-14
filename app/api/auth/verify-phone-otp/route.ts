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

        console.log(`Verifying phone OTP: ${otp} for phone: ${phone}`);

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

        // Check if user exists with this phone and update if they do
        // If not, that's okay - we'll update during signup
        try {
            const existingUser = await prisma.user.findUnique({
                where: { phone }
            });

            if (existingUser) {
                console.log('Updating existing user phone verification');
                await prisma.user.update({
                    where: { phone },
                    data: { phoneVerified: true }
                });
            } else {
                console.log('No user found with this phone - will be updated during signup');
            }
        } catch (userError) {
            console.log('User update not required or user not found yet');
            // It's okay if user doesn't exist yet - we'll handle during signup
        }

        return NextResponse.json(
            { message: 'Phone number verified successfully' },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Verify phone OTP error:', error);
        return NextResponse.json(
            { error: 'Verification failed: ' + error.message },
            { status: 500 }
        );
    }
}