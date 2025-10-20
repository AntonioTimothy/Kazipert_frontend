import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-change-in-production';

export async function POST(request: NextRequest) {
    try {
        const { refreshToken } = await request.json();

        if (!refreshToken) {
            return NextResponse.json(
                { error: 'Refresh token is required' },
                { status: 400 }
            );
        }

        // Verify refresh token
        const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { id: string };

        // Check if refresh token exists in database
        const storedToken = await prisma.refreshToken.findUnique({
            where: { token: refreshToken },
            include: { user: true }
        });

        if (!storedToken || storedToken.expiresAt < new Date()) {
            return NextResponse.json(
                { error: 'Invalid or expired refresh token' },
                { status: 401 }
            );
        }

        // Generate new tokens
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokens(
            storedToken.user.id,
            storedToken.user.email,
            storedToken.user.role
        );

        // Delete old refresh token
        await prisma.refreshToken.delete({
            where: { id: storedToken.id }
        });

        // Store new refresh token
        await prisma.refreshToken.create({
            data: {
                token: newRefreshToken,
                userId: storedToken.user.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }
        });

        const response = NextResponse.json(
            {
                message: 'Token refreshed successfully',
                accessToken: newAccessToken,
                refreshToken: newRefreshToken
            },
            { status: 200 }
        );

        // Set new cookies
        response.cookies.set('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60
        });

        response.cookies.set('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60
        });

        return response;
    } catch (error: any) {
        console.error('Token refresh error:', error);
        return NextResponse.json(
            { error: 'Invalid refresh token' },
            { status: 401 }
        );
    }
}

function generateTokens(userId: string, email: string, role: string) {
    const accessToken = jwt.sign(
        { id: userId, email, role },
        JWT_SECRET,
        { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
        { id: userId },
        JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
}