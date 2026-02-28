import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/login', '/signup']
const STUDENT_PATHS = ['/dashboard', '/peace-bot', '/breathe', '/focus', '/gratitude', '/journal', '/mood-tracker', '/counseling', '/experts', '/screening', '/community', '/resources', '/profile', '/workshops']
const ADMIN_PATHS = ['/admin']
const THERAPIST_PATHS = ['/therapist']

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    const isAuth = request.cookies.get('peacecode_auth')?.value === '1'
    const role = request.cookies.get('peacecode_role')?.value

    // Allow public paths
    if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
        // If already logged in, redirect to their dashboard
        if (isAuth && role) {
            return NextResponse.redirect(new URL(roleDashboard(role), request.url))
        }
        return NextResponse.next()
    }

    // Redirect root to login or dashboard
    if (pathname === '/') {
        if (isAuth && role) {
            return NextResponse.redirect(new URL(roleDashboard(role), request.url))
        }
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Not authenticated → redirect to login
    if (!isAuth) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Role-based protection
    if (ADMIN_PATHS.some((p) => pathname.startsWith(p)) && role !== 'admin') {
        return NextResponse.redirect(new URL(roleDashboard(role || 'student'), request.url))
    }
    if (THERAPIST_PATHS.some((p) => pathname.startsWith(p)) && role !== 'therapist') {
        return NextResponse.redirect(new URL(roleDashboard(role || 'student'), request.url))
    }
    if (STUDENT_PATHS.some((p) => pathname.startsWith(p)) && role !== 'student') {
        return NextResponse.redirect(new URL(roleDashboard(role || 'student'), request.url))
    }

    return NextResponse.next()
}

function roleDashboard(role: string) {
    if (role === 'admin') return '/admin/dashboard'
    if (role === 'therapist') return '/therapist/dashboard'
    return '/dashboard'
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|assets/).*)'],
}
