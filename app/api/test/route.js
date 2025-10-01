import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ 
      message: 'MongoDB connected successfully!',
      status: 'connected' 
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return NextResponse.json({ 
      message: 'MongoDB connection failed',
      error: error.message,
      status: 'error' 
    }, { status: 500 });
  }
}
