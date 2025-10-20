// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Handle preflight requests for file uploads
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
        })
    }

    const response = NextResponse.next()

    // Add CORS headers for all API routes
    if (request.nextUrl.pathname.startsWith('/api/')) {
        response.headers.set('Access-Control-Allow-Origin', '*')
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    }

    return response
}

export const config = {
    matcher: [
        '/api/:path*',
        // Add other paths if needed
    ],
}