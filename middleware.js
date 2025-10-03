import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export function middleware(request) {
  const { pathname } = request.nextUrl;
   
  // Skip middleware for static files, API routes, and Next.js internals
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }
  
  // Get user session from cookies
  const authToken = request.cookies.get('auth-token');
  console.log('Middleware - Path:', pathname, 'Auth Token:', !!authToken?.value);
  
  // Protected routes that require authentication
  const protectedRoutes = ['/profile', '/checkout', '/history'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  // Auth routes - only redirect if user is actually authenticated
  const authRoutes = ['/login', '/register'];
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  
  // Only redirect to login if accessing protected route without valid token
  if (isProtectedRoute && (!authToken || !authToken.value)) {
    console.log('Redirecting to login - protected route without token');
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Only redirect away from auth routes if user has a valid token AND we can verify it
  if (isAuthRoute && authToken?.value) {
    try {
      // Try to verify the token before redirecting
      jwt.verify(authToken.value, JWT_SECRET);
      console.log('Redirecting to home - valid token on auth route');
      return NextResponse.redirect(new URL('/', request.url));
    } catch (error) {
      // Token is invalid, let them access the auth route
      console.log('Invalid token, allowing access to auth route');
      return NextResponse.next();
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};