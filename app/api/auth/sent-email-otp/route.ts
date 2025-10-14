import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function generateOtp(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        // Generate OTP
        const otp = generateOtp();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Store OTP in database
        await prisma.otpVerification.create({
            data: {
                email,
                otp,
                type: 'EMAIL',
                expiresAt
            }
        });

        // For now, just log the OTP (replace with email service later)
        console.log(`Email OTP for ${email}: ${otp}`);

        return NextResponse.json(
            { message: 'Verification code sent to email' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Send email OTP error:', error);
        return NextResponse.json(
            { error: 'Failed to send verification code' },
            { status: 500 }
        );
    }
}