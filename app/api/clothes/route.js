import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Cloth from '../../../models/Cloth';
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

export async function GET(request) {
  const basePath = process.env.NEXT_PUBLIC_API_URL || '';
  
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const sale = searchParams.get('sale');
    const userId = searchParams.get('userId'); // For fetching user's own listings
    const marketplace = searchParams.get('marketplace'); // For marketplace (user items only)
    
    let query = {};
    
    // Filter by source (shop vs user listings)
    if (marketplace === 'true') {
      // Show only active user listings in marketplace (exclude sold)
      query.user = { $ne: null };
      query.status = 'active';
      console.log('🛍️  GET Marketplace query:', query);
    } else if (userId) {
      // Show specific user's listings (all statuses including sold)
      query.user = userId;
      console.log('👤 GET User listings query:', query);
    } else {
      // Default: show only shop items (user = null)
      query.user = null;
      console.log('🏪 GET Shop items query:', query);
    }
    
    if (category && category !== 'All') {
      query.category = category;
    }
    
    if (sale === 'true') {
      query.sale = true;
    }
    
    const clothes = await Cloth.find(query).sort({ createdAt: -1 });
    console.log(`📊 Found ${clothes.length} items`);
    
    return NextResponse.json(clothes.map(cloth => ({ ...cloth.toObject(), basePath: basePath })));
    
  } catch (error) {
    console.error('❌ Clothes API error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch clothes', basePath: basePath },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const basePath = process.env.NEXT_PUBLIC_API_URL || '';
  
  try {
    await connectDB();
    
    const clothData = await request.json();
    console.log('📦 POST /api/clothes - Received data:', { 
      isUserListing: clothData.isUserListing,
      name: clothData.name,
      sizes: clothData.sizes 
    });
    
    // Check if this is a user listing
    const userToken = getUserFromToken(request);
    console.log('👤 User token:', userToken ? `User ID: ${userToken.userId}, Name: ${userToken.name}, Email: ${userToken.email}` : 'No token');
    
    if (clothData.isUserListing && userToken) {
      // Add user information to the listing
      clothData.user = userToken.userId;
      clothData.userName = userToken.name;
      clothData.userEmail = userToken.email;
      clothData.status = 'active';
      
      console.log('📝 Setting user data:', {
        user: clothData.user,
        userName: clothData.userName,
        userEmail: clothData.userEmail
      });
      
      // Ensure sizes is an array
      if (typeof clothData.sizes === 'string') {
        clothData.sizes = [clothData.sizes];
      }
      console.log('✅ Creating USER listing with user:', userToken.userId);
    } else {
      // Shop listing - ensure user is null
      clothData.user = null;
      clothData.userName = null;
      clothData.userEmail = null;
      clothData.status = null;
      console.log('🏪 Creating SHOP listing (user=null)');
    }
    
    // Remove isUserListing flag before saving
    delete clothData.isUserListing;
    
    const cloth = new Cloth(clothData);
    await cloth.save();
    
    console.log('💾 Saved cloth:', { 
      _id: cloth._id, 
      user: cloth.user,
      userName: cloth.userName,
      userEmail: cloth.userEmail,
      status: cloth.status,
      name: cloth.name 
    });
    
    return NextResponse.json({ ...cloth.toObject(), basePath: basePath }, { status: 201 });
    
  } catch (error) {
    console.error('❌ Create cloth error:', error);
    return NextResponse.json(
      { message: 'Failed to create cloth item', error: error.message, basePath: basePath },
      { status: 500 }
    );
  }
}