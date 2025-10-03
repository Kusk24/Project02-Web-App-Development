import { NextResponse } from 'next/server';

export async function POST(request) {
  const basePath = process.env.NEXT_PUBLIC_API_URL || '';
  
  const response = NextResponse.json({ 
    success: true,
    basePath: basePath
  });
  
  // Clear the session cookie
  response.cookies.delete('user-session');
  
  return response;
}
