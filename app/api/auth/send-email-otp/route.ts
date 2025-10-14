import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function generateOtp(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        console.log('Send email OTP request:', { email });

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        // Check if email is already verified for an existing user
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser && existingUser.emailVerified) {
            return NextResponse.json(
                { error: 'Email is already verified and in use' },
                { status: 409 }
            );
        }

        // Generate OTP
        const otp = generateOtp();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        console.log(`Generated OTP for email ${email}: ${otp}`);

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
        console.log(`📧 Email OTP for ${email}: ${otp} (Expires: ${expiresAt})`);

        return NextResponse.json(
            {
                message: 'Verification code sent to email',
                debug: `OTP: ${otp} (check console)`
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Send email OTP error:', error);
        return NextResponse.json(
            { error: 'Failed to send verification code: ' + error.message },
            { status: 500 }
        );
    }
}