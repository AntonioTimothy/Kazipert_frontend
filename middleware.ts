// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken, verifyRefreshToken } from './lib/auth'

export async function middleware(request: NextRequest) {
    // Get tokens from cookies
    const accessToken = request.cookies.get('accessToken')?.value
    const refreshToken = request.cookies.get('refreshToken')?.value

    // Protected routes
    const protectedRoutes = [
        '/worker/onboarding',
        '/worker/dashboard',
        '/worker/jobs',
        '/worker/contracts',
        '/worker/payments',
        '/api/onboarding',
        '/api/worker'
    ]

    const isProtectedRoute = protectedRoutes.some(route =>
        request.nextUrl.pathname.startsWith(route)
    )

    if (isProtectedRoute) {
        let isValidToken = false
        let shouldRefresh = false

        // Check access token first
        if (accessToken) {
            try {
                verifyToken(accessToken)
                isValidToken = true
            } catch (error) {
                // Access token is invalid or expired
                if (error instanceof Error && error.message.includes('expired')) {
                    shouldRefresh = true
                }
            }
        }

        // If access token is expired but we have a refresh token, try to refresh
        if (shouldRefresh && refreshToken) {
            try {
                // Verify refresh token is still valid
                verifyRefreshToken(refreshToken)

                // Create a response that will trigger token refresh on the client
                const response = NextResponse.next()

                // Add a header to indicate token needs refresh
                response.headers.set('x-token-expired', 'true')

                return response
            } catch (error) {
                // Refresh token is also invalid, redirect to login
                console.log('Refresh token invalid, redirecting to login')
                return redirectToLogin(request)
            }
        }

        // If no valid token and no refresh possible, redirect to login
        if (!isValidToken && !shouldRefresh) {
            return redirectToLogin(request)
        }
    }

    return NextResponse.next()
}

function redirectToLogin(request: NextRequest) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)

    const response = NextResponse.redirect(loginUrl)

    // Clear invalid tokens
    response.cookies.set('accessToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
    })

    response.cookies.set('refreshToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
    })

    return response
}

export const config = {
    matcher: [
        '/worker/onboarding/:path*',
        '/worker/dashboard/:path*',
        '/worker/jobs/:path*',
        '/worker/contracts/:path*',
        '/worker/payments/:path*',
        '/api/onboarding/:path*',
        '/api/worker/:path*'
    ]
}