// lib/auth.ts
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-change-in-production';

export interface TokenPayload {
    userId: string;
    email: string;
    role: string;
    iat?: number;
    exp?: number;
}

export function generateAccessToken(user: any): string {
    const payload: TokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
    };

    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: '15m', // 15 minutes
    });
}

export function generateRefreshToken(user: any): string {
    const payload: TokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
    };

    return jwt.sign(payload, JWT_REFRESH_SECRET, {
        expiresIn: '7d', // 7 days
    });
}

export function verifyToken(token: string): TokenPayload {
    try {
        return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new Error('Token expired');
        }
        if (error instanceof jwt.JsonWebTokenError) {
            throw new Error('Invalid token');
        }
        throw error;
    }
}

export function verifyRefreshToken(token: string): TokenPayload {
    try {
        return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new Error('Refresh token expired');
        }
        if (error instanceof jwt.JsonWebTokenError) {
            throw new Error('Invalid refresh token');
        }
        throw error;
    }
}

// Cookie Management Functions
export async function setAuthCookies(user: any) {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax' as const,
        path: '/',
    };

    // Set access token cookie (short-lived)
    cookies().set('accessToken', accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60, // 15 minutes
    });

    // Set refresh token cookie (long-lived, more secure)
    cookies().set('refreshToken', refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return { accessToken, refreshToken };
}

export async function clearAuthCookies() {
    cookies().delete('accessToken');
    cookies().delete('refreshToken');
    cookies().delete('token'); // Clear legacy token if exists
}

export async function getAccessToken(): Promise<string | null> {
    try {
        const cookieStore = cookies();
        return cookieStore.get('accessToken')?.value || null;
    } catch (error) {
        console.error('Error getting access token:', error);
        return null;
    }
}

export async function getRefreshToken(): Promise<string | null> {
    try {
        const cookieStore = cookies();
        return cookieStore.get('refreshToken')?.value || null;
    } catch (error) {
        console.error('Error getting refresh token:', error);
        return null;
    }
}

// Enhanced user verification with token refresh
export async function getCurrentUser() {
    try {
        let accessToken = await getAccessToken();

        // If no access token, try to use refresh token
        if (!accessToken) {
            console.log('No access token found, attempting refresh...');
            accessToken = await refreshAccessToken();
            if (!accessToken) {
                console.log('Token refresh failed, no user session');
                return null;
            }
        }

        // Verify the access token
        try {
            const payload = verifyToken(accessToken);
            console.log('User authenticated successfully:', payload.email);
            return {
                id: payload.userId,
                email: payload.email,
                role: payload.role,
            };
        } catch (error) {
            if (error instanceof Error && error.message === 'Token expired') {
                console.log('Access token expired, attempting refresh...');
                // Token expired, try to refresh
                const newAccessToken = await refreshAccessToken();
                if (newAccessToken) {
                    const payload = verifyToken(newAccessToken);
                    console.log('Token refreshed successfully for user:', payload.email);
                    return {
                        id: payload.userId,
                        email: payload.email,
                        role: payload.role,
                    };
                }
            }
            console.error('Token verification failed:', error);
            return null;
        }
    } catch (error) {
        console.error('Failed to get current user:', error);
        return null;
    }
}

// Token refresh functionality
export async function refreshAccessToken(): Promise<string | null> {
    try {
        const refreshToken = await getRefreshToken();

        if (!refreshToken) {
            console.log('No refresh token available for refresh');
            return null;
        }

        console.log('Attempting to refresh access token...');

        // Verify refresh token
        let payload: TokenPayload;
        try {
            payload = verifyRefreshToken(refreshToken);
        } catch (error) {
            console.error('Refresh token verification failed:', error);
            await clearAuthCookies();
            return null;
        }

        // Generate new access token
        const user = {
            id: payload.userId,
            email: payload.email,
            role: payload.role,
        };

        const newAccessToken = generateAccessToken(user);

        // Update access token cookie
        const isProduction = process.env.NODE_ENV === 'production';
        cookies().set('accessToken', newAccessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            maxAge: 15 * 60,
            path: '/',
        });

        console.log('Access token refreshed successfully for user:', user.email);
        return newAccessToken;
    } catch (error) {
        console.error('Token refresh failed:', error);
        await clearAuthCookies();
        return null;
    }
}

// Utility function to check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
    const user = await getCurrentUser();
    return !!user;
}

// Get user role for authorization
export async function getUserRole(): Promise<string | null> {
    const user = await getCurrentUser();
    return user?.role || null;
}

// Validate token without refreshing (for middleware)
export async function validateToken(token: string): Promise<{ valid: boolean; payload?: TokenPayload; error?: string }> {
    try {
        const payload = verifyToken(token);
        return { valid: true, payload };
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return { valid: false, error: 'Token expired' };
        }
        if (error instanceof jwt.JsonWebTokenError) {
            return { valid: false, error: 'Invalid token' };
        }
        return { valid: false, error: 'Token validation failed' };
    }
}

// Validate refresh token (for API routes)
export async function validateRefreshToken(token: string): Promise<{ valid: boolean; payload?: TokenPayload; error?: string }> {
    try {
        const payload = verifyRefreshToken(token);
        return { valid: true, payload };
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return { valid: false, error: 'Refresh token expired' };
        }
        if (error instanceof jwt.JsonWebTokenError) {
            return { valid: false, error: 'Invalid refresh token' };
        }
        return { valid: false, error: 'Refresh token validation failed' };
    }
}

// Get user from token (for API routes that receive token in headers)
export function getUserFromToken(token: string): TokenPayload | null {
    try {
        return verifyToken(token);
    } catch (error) {
        console.error('Failed to get user from token:', error);
        return null;
    }
}

// Check if token is about to expire (for proactive refresh)
export function isTokenExpiringSoon(token: string, thresholdMinutes: number = 5): boolean {
    try {
        const payload = verifyToken(token) as any;
        if (!payload.exp) return false;

        const now = Math.floor(Date.now() / 1000);
        const timeUntilExpiry = payload.exp - now;
        const thresholdSeconds = thresholdMinutes * 60;

        return timeUntilExpiry <= thresholdSeconds;
    } catch (error) {
        return true; // If we can't verify, consider it expiring
    }
}

// Debug function to check auth state
export async function debugAuthState(): Promise<{
    hasAccessToken: boolean;
    hasRefreshToken: boolean;
    user: any;
    accessTokenValid: boolean;
    refreshTokenValid: boolean;
}> {
    const accessToken = await getAccessToken();
    const refreshToken = await getRefreshToken();
    const user = await getCurrentUser();

    let accessTokenValid = false;
    let refreshTokenValid = false;

    if (accessToken) {
        try {
            verifyToken(accessToken);
            accessTokenValid = true;
        } catch (error) {
            accessTokenValid = false;
        }
    }

    if (refreshToken) {
        try {
            verifyRefreshToken(refreshToken);
            refreshTokenValid = true;
        } catch (error) {
            refreshTokenValid = false;
        }
    }

    return {
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
        user,
        accessTokenValid,
        refreshTokenValid,
    };
}