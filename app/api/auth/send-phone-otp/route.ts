import { NextRequest, NextResponse } from 'next/server';
import { otpService } from '@/lib/services/otpService';

export async function POST(request: NextRequest) {
    try {
        const { phone } = await request.json();

        console.log('Send phone OTP request:', { phone });

        const result = await otpService.sendPhoneOtp(phone);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 400 }
            );
        }

        const responseData: any = {
            message: result.message,
        };

        // Include debug OTP in development only
        if (process.env.NODE_ENV === 'development' && result.debugOtp) {
            responseData.debugOtp = result.debugOtp;
        }

        return NextResponse.json(responseData, { status: 200 });
    } catch (error: any) {
        console.error('Send phone OTP error:', error);
        return NextResponse.json(
            { error: 'Failed to send verification code: ' + error.message },
            { status: 500 }
        );
    }
}