import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function generateOtp(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

export async function POST(request: NextRequest) {
    try {
        const { phone } = await request.json();

        console.log('Send phone OTP request:', { phone });

        if (!phone) {
            return NextResponse.json(
                { error: 'Phone number is required' },
                { status: 400 }
            );
        }

        // Check if phone is already verified for an existing user
        const existingUser = await prisma.user.findUnique({
            where: { phone }
        });

        if (existingUser && existingUser.phoneVerified) {
            return NextResponse.json(
                { error: 'Phone number is already verified and in use' },
                { status: 409 }
            );
        }

        // Generate OTP
        const otp = generateOtp();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        console.log(`Generated OTP for phone ${phone}: ${otp}`);

        // Store OTP in database
        await prisma.otpVerification.create({
            data: {
                phone,
                otp,
                type: 'PHONE',
                expiresAt
            }
        });

        // For now, just log the OTP (replace with SMS service later)
        console.log(`📱 Phone OTP for ${phone}: ${otp} (Expires: ${expiresAt})`);

        return NextResponse.json(
            {
                message: 'Verification code sent to phone',
                debug: `OTP: ${otp} (check console)`
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Send phone OTP error:', error);
        return NextResponse.json(
            { error: 'Failed to send verification code: ' + error.message },
            { status: 500 }
        );
    }
}