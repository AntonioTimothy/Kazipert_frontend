import { NextRequest, NextResponse } from 'next/server';
import { otpService } from '@/lib/services/otpService';

export async function POST(request: NextRequest) {
    try {
        const { email, otp } = await request.json();

        console.log('Verify email OTP request:', { email });

        if (!email || !otp) {
            return NextResponse.json(
                { error: 'Email and OTP are required' },
                { status: 400 }
            );
        }

        const result = await otpService.verifyEmailOtp(email, otp);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 500 }
            );
        }

        if (!result.verified) {
            return NextResponse.json(
                { error: result.error || 'Invalid verification code' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: result.message },
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