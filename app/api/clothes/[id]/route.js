import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Cloth from '../../../../models/Cloth';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper function to get user from token
function getUserFromToken(request) {
  const token = request.cookies.get('auth-token')?.value;
  if (!token) return null;
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}

// GET single cloth item by ID
export async function GET(request, { params }) {
  const basePath = process.env.NEXT_PUBLIC_API_URL || '';
  
  try {
    await connectDB();
    const { id } = await params;
    
    const cloth = await Cloth.findById(id);
    
    if (!cloth) {
      return NextResponse.json(
        { message: 'Cloth item not found', basePath },
        { status: 404 }
      );
    }
    
    // Increment view count for user listings
    if (cloth.user) {
      cloth.views += 1;
      await cloth.save();
    }
    
    return NextResponse.json({ ...cloth.toObject(), basePath });
  } catch (error) {
    console.error('Error fetching cloth:', error);
    return NextResponse.json(
      { message: 'Failed to fetch cloth item', basePath },
      { status: 500 }
    );
  }
}

// PATCH - Update cloth item
export async function PATCH(request, { params }) {
  const basePath = process.env.NEXT_PUBLIC_API_URL || '';
  
  try {
    await connectDB();
    const { id } = await params;
    const updateData = await request.json();
    
    // Get user from token
    const userToken = getUserFromToken(request);
    
    // Find cloth item
    const cloth = await Cloth.findById(id);
    if (!cloth) {
      return NextResponse.json(
        { message: 'Cloth item not found', basePath },
        { status: 404 }
      );
    }
    
    // If it's a user listing, verify ownership
    if (cloth.user) {
      if (!userToken || cloth.user.toString() !== userToken.userId) {
        return NextResponse.json(
          { message: 'You can only edit your own listings', basePath },
          { status: 403 }
        );
      }
    }
    
    // Update allowed fields
    const allowedUpdates = [
      'name', 'description', 'price', 'originalPrice', 
      'category', 'sizes', 'condition', 'brand', 
      'image', 'status', 'sale', 'inStock'
    ];
    
    allowedUpdates.forEach(field => {
      if (updateData[field] !== undefined) {
        cloth[field] = updateData[field];
      }
    });
    
    cloth.updatedAt = new Date();
    await cloth.save();
    
    return NextResponse.json({ 
      message: 'Cloth item updated successfully',
      cloth: { ...cloth.toObject(), basePath }
    });
  } catch (error) {
    console.error('Error updating cloth:', error);
    return NextResponse.json(
      { message: 'Failed to update cloth item', basePath },
      { status: 500 }
    );
  }
}

// DELETE cloth item
export async function DELETE(request, { params }) {
  const basePath = process.env.NEXT_PUBLIC_API_URL || '';
  
  try {
    await connectDB();
    const { id } = await params;
    
    // Get user from token
    const userToken = getUserFromToken(request);
    
    // Find cloth item
    const cloth = await Cloth.findById(id);
    if (!cloth) {
      return NextResponse.json(
        { message: 'Cloth item not found', basePath },
        { status: 404 }
      );
    }
    
    // If it's a user listing, verify ownership
    if (cloth.user) {
      if (!userToken || cloth.user.toString() !== userToken.userId) {
        return NextResponse.json(
          { message: 'You can only delete your own listings', basePath },
          { status: 403 }
        );
      }
    }
    
    await Cloth.findByIdAndDelete(id);
    
    return NextResponse.json({ 
      message: 'Cloth item deleted successfully',
      basePath 
    });
  } catch (error) {
    console.error('Error deleting cloth:', error);
    return NextResponse.json(
      { message: 'Failed to delete cloth item', basePath },
      { status: 500 }
    );
  }
}
