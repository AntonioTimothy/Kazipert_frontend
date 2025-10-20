import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-fallback-secret';

export interface TokenPayload {
    userId: string;
    email: string;
    role: string;
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

    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: '7d', // 7 days
    });
}

export function verifyToken(token: string): TokenPayload {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
}