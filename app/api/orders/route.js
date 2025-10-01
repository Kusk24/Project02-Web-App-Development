import connectDB from '../../../lib/mongodb';
import Sale from '../../../models/Sale';

export async function GET(req) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get('email');
    
    let query = {};
    if (userEmail) {
      query = { 'user.email': userEmail };
    }
    
    const orders = await Sale.find(query).sort({ createdAt: -1 });
    return Response.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return Response.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    
    const newOrder = new Sale(body);
    await newOrder.save();
    
    return Response.json(newOrder, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return Response.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
