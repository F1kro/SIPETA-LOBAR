import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = ['/admin']
const authRoutes = ['/auth/login']

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))
  const isAuthRoute = authRoutes.some(route => path.startsWith(route))

  // Cek session dari cookie
  const userId = request.cookies.get('userId')?.value
  const userEmail = request.cookies.get('userEmail')?.value
  const hasSession = userId && userEmail

  // Redirect ke login jika akses protected route tanpa session
  if (isProtectedRoute && !hasSession) {
    const loginUrl = new URL('/auth/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect ke admin jika sudah login tapi akses halaman login
  if (isAuthRoute && hasSession) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}