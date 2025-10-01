import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Sale from '../../../models/Sale';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

function verifyToken(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function GET(request) {
  try {
    const decoded = verifyToken(request);
    if (!decoded) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const sales = await Sale.find({ user: decoded.userId })
      .populate('user', 'name email')
      .sort({ date: -1 });
    
    return NextResponse.json(sales);
    
  } catch (error) {
    console.error('Sales API error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch sales' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const decoded = verifyToken(request);
    if (!decoded) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const saleData = await request.json();
    saleData.user = decoded.userId;
    
    const sale = new Sale(saleData);
    await sale.save();
    
    return NextResponse.json(sale, { status: 201 });
    
  } catch (error) {
    console.error('Create sale error:', error);
    return NextResponse.json(
      { message: 'Failed to create sale' },
      { status: 500 }
    );
  }
}
