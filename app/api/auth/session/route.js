import { NextResponse } from 'next/server';

export async function GET(request) {
  const sessionCookie = request.cookies.get('user-session');
  
  if (sessionCookie) {
    try {
      const user = JSON.parse(sessionCookie.value);
      return NextResponse.json({ user, authenticated: true });
    } catch (error) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
  }
  
  return NextResponse.json({ authenticated: false }, { status: 401 });
}
