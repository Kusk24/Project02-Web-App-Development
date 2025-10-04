import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Sale from '../../../models/Sale';
import jwt from 'jsonwebtoken';

export const runtime = 'nodejs';

// GET orders (optionally filter by email)
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get('email');

    let query = {};
    if (userEmail) {
      query = { 'userInfo.email': userEmail }; // ✅ match against userInfo, not user ObjectId
    }

    const orders = await Sale.find(query).sort({ createdAt: -1 }).populate('user', 'name email');

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

// POST new order (requires login)
export async function POST(req) {
  try {
    await connectDB();

    const token = req.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'You must log in first' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
    } catch (err) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const body = await req.json();

    // ✅ only store userId in Sale.user
    const newOrder = new Sale({
      user: decoded.userId,
      userInfo: {
        ...body.userInfo,
        email: decoded.email, // enforce email consistency
      },
      items: body.items,
      total: body.total,
      status: body.status || 'pending',
      paymentProof: body.paymentProof,
      deliveryEstimate: body.deliveryEstimate,
      cancellationDeadline: body.cancellationDeadline,
    });

    await newOrder.save();

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}