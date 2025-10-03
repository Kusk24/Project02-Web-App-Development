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
    
    const { name, email, password, phone, address } = await request.json();
    
    // Validation
    if (!name || !email || !password || !phone || !address) {
      return NextResponse.json(
        { message: 'All fields are required', basePath: basePath },
        { status: 400 }
      );
    }
    
    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters', basePath: basePath },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists with this email', basePath: basePath },
        { status: 400 }
      );
    }
    
    // Create new user
    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
      phone,
      address
    });
    
    await user.save();
    
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
    }, { status: 201 });
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error: ' + error.message, basePath: basePath },
      { status: 500 }
    );
  }
}
