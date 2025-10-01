import { NextResponse } from 'next/server';

export async function POST(request) {
  const response = NextResponse.json({ success: true });
  
  // Clear the session cookie
  response.cookies.delete('user-session');
  
  return response;
}
