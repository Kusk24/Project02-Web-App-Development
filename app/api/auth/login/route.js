import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import User from '../../../../models/User';
import jwt from 'jsonwebtoken';

// Force Node.js runtime for JWT compatibility
export const runtime = 'nodejs';

export async function POST(request) {
  const basePath = process.env.NEXT_PUBLIC_API_URL || '';
  
  try {
    await connectDB();
    
    const { email, password } = await request.json();
    
    console.log('Login attempt for email:', email);
    
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required', basePath: basePath },
        { status: 400 }
      );
    }
    
    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid credentials', basePath: basePath },
        { status: 401 }
      );
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    console.log('Password match:', isMatch);
    
    if (!isMatch) {
      return NextResponse.json(
        { message: 'Invalid credentials', basePath: basePath },
        { status: 401 }
      );
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '7d' }
    );
    
    // Return success response
    return NextResponse.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address
      },
      basePath: basePath
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error: ' + error.message, basePath: basePath },
      { status: 500 }
    );
  }
}