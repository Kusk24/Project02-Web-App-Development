import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';

export async function GET() {
  const basePath = process.env.NEXT_PUBLIC_API_URL || '';
  
  try {
    await dbConnect();
    return NextResponse.json({ 
      message: 'MongoDB connected successfully!',
      status: 'connected',
      basePath: basePath
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return NextResponse.json({ 
      message: 'MongoDB connection failed',
      error: error.message,
      status: 'error',
      basePath: basePath
    }, { status: 500 });
  }
}
