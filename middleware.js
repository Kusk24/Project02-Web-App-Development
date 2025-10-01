import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Get user session from cookies
  const userSession = request.cookies.get('user-session');
  
  // Protected routes that require authentication
  const protectedRoutes = ['/profile', '/checkout', '/history'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  // Public routes that should redirect to home if logged in
  const authRoutes = ['/login', '/signup'];
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  
  // Redirect to login if accessing protected route without session
  if (isProtectedRoute && !userSession) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Redirect to home if accessing auth routes while logged in
  if (isAuthRoute && userSession) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // Only protect API routes that need authentication
  if (request.nextUrl.pathname.startsWith('/api/sales') ||
      request.nextUrl.pathname.startsWith('/api/users')) {
    
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const token = authHeader.substring(7);
    
    try {
      jwt.verify(token, JWT_SECRET);
      return NextResponse.next();
    } catch (error) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
    '/api/sales/:path*',
    '/api/users/:path*'
  ],
};
