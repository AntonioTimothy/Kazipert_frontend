import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function generateOtp(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

export async function POST(request: NextRequest) {
    try {
        const { phone } = await request.json();

        if (!phone) {
            return NextResponse.json(
                { error: 'Phone number is required' },
                { status: 400 }
            );
        }

        // Generate OTP
        const otp = generateOtp();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

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
        console.log(`Phone OTP for ${phone}: ${otp}`);

        return NextResponse.json(
            { message: 'Verification code sent to phone' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Send phone OTP error:', error);
        return NextResponse.json(
            { error: 'Failed to send verification code' },
            { status: 500 }
        );
    }
}