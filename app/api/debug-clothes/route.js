import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Cloth from '../../../models/Cloth';

export async function GET(request) {
  try {
    await connectDB();
    
    // Fetch ALL clothes without any filter
    const allClothes = await Cloth.find({}).sort({ createdAt: -1 });
    
    console.log('🔍 DEBUG: Total clothes in database:', allClothes.length);
    console.log('🔍 DEBUG: User listings:', allClothes.filter(c => c.user).length);
    console.log('🔍 DEBUG: Shop items:', allClothes.filter(c => !c.user).length);
    
    return NextResponse.json(allClothes.map(c => c.toObject()));
  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
