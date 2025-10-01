import connectDB from '../../../../lib/mongodb';
import Sale from '../../../../models/Sale';

export async function GET(req, { params }) {
  try {
    await connectDB();
    const order = await Sale.findById(params.id);
    
    if (!order) {
      return Response.json({ error: 'Order not found' }, { status: 404 });
    }
    
    return Response.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return Response.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const body = await req.json();
    
    const order = await Sale.findByIdAndUpdate(
      params.id,
      { ...body, updatedAt: new Date() },
      { new: true }
    );
    
    if (!order) {
      return Response.json({ error: 'Order not found' }, { status: 404 });
    }
    
    return Response.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    return Response.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
