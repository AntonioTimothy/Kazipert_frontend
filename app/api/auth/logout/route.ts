import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const { refreshToken } = await request.json();

        if (refreshToken) {
            // Delete refresh token from database
            await prisma.refreshToken.deleteMany({
                where: { token: refreshToken }
            });
        }

        const response = NextResponse.json(
            { message: 'Logout successful' },
            { status: 200 }
        );

        // Clear cookies
        response.cookies.set('accessToken', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 0
        });

        response.cookies.set('refreshToken', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 0
        });

        return response;
    } catch (error: any) {
        console.error('Logout error:', error);
        return NextResponse.json(
            { error: 'Logout failed' },
            { status: 500 }
        );
    }
}