import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '../../../../models/User';
import connectDB from '../../../../lib/mongodb';

export const runtime = 'nodejs';

export async function GET(request) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Verify JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback-secret-key'
    );

    await connectDB();

    // Fetch user but exclude password
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true, user });
  } catch (error) {
    console.error('Session check failed:', error);
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}