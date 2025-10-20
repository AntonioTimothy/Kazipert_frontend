import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { generateAccessToken, generateRefreshToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const { email, otp, password } = await request.json();

        console.log('Verify login OTP for:', email);

        if (!email || !otp || !password) {
            return NextResponse.json(
                { error: 'Email, OTP, and password are required' },
                { status: 400 }
            );
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Verify password again for security
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Find valid OTP
        const verification = await prisma.otpVerification.findFirst({
            where: {
                email,
                type: 'LOGIN',
                otp,
                expiresAt: {
                    gt: new Date(),
                },
                verified: false,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        if (!verification) {
            return NextResponse.json(
                { error: 'Invalid or expired verification code' },
                { status: 400 }
            );
        }

        // Mark OTP as verified
        await prisma.otpVerification.update({
            where: { id: verification.id },
            data: { verified: true },
        });

        // Generate tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Store refresh token
        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            },
        });

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;

        console.log('Login successful for user:', user.email);

        return NextResponse.json({
            message: 'Login successful',
            user: userWithoutPassword,
            accessToken,
            refreshToken,
        }, { status: 200 });

    } catch (error: any) {
        console.error('Verify login OTP error:', error);
        return NextResponse.json(
            { error: 'Verification failed. Please try again.' },
            { status: 500 }
        );
    }
}