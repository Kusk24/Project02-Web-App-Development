import connectDB from '../../../../lib/mongodb';
import Sale from '../../../../models/Sale';
import Cloth from '../../../../models/Cloth';

// GET order by ID
export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params; // ✅ await params
    const order = await Sale.findById(id);

    if (!order) {
      return Response.json({ error: 'Order not found' }, { status: 404 });
    }

    return Response.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return Response.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

// PUT (full update, keep if needed for admin edits)
export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = await params; // ✅ await params
    const body = await req.json();

    const order = await Sale.findByIdAndUpdate(
      id,
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

// PATCH (for partial update like payment proof upload)
export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const { id } = await params; // ✅ await params
    const body = await req.json();

    const updateFields = {};
    if (body.status) updateFields.status = body.status;
    if (body.paymentProof) updateFields.paymentProof = body.paymentProof;
    if (body.deliveryEstimate) updateFields.deliveryEstimate = body.deliveryEstimate;
    if (body.cancellationDeadline !== undefined) {
      updateFields.cancellationDeadline = body.cancellationDeadline;
    }

    const order = await Sale.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    if (!order) {
      return Response.json({ error: 'Order not found' }, { status: 404 });
    }

    return Response.json(order);
  } catch (error) {
    console.error('Error patching order:', error);
    return Response.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

// DELETE order by ID (Cancel order)
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = await params; // ✅ await params

    const deletedOrder = await Sale.findByIdAndDelete(id);

    if (!deletedOrder) {
      return Response.json({ error: 'Order not found' }, { status: 404 });
    }

    // Reactivate user listings that were marked as sold
    console.log('🔄 Order cancelled, reactivating user listings...');
    for (const item of deletedOrder.items) {
      try {
        const cloth = await Cloth.findById(item.id);
        if (cloth && cloth.user && cloth.status === 'sold') {
          // This was a user listing marked as sold, reactivate it
          cloth.status = 'active';
          await cloth.save();
          console.log(`✅ Reactivated cloth ${cloth._id} (${cloth.name}) - now ACTIVE`);
        }
      } catch (err) {
        console.error(`❌ Error reactivating cloth ${item.id}:`, err);
        // Continue with cancellation even if reactivation fails
      }
    }

    return Response.json({ message: 'Order cancelled successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    return Response.json({ error: 'Failed to cancel order' }, { status: 500 });
  }
}