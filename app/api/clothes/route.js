import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Cloth from '../../../models/Cloth';

export async function GET(request) {
  const basePath = process.env.NEXT_PUBLIC_API_URL || '';
  
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const sale = searchParams.get('sale');
    
    let query = {};
    
    if (category && category !== 'All') {
      query.category = category;
    }
    
    if (sale === 'true') {
      query.sale = true;
    }
    
    const clothes = await Cloth.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json(clothes.map(cloth => ({ ...cloth.toObject(), basePath: basePath })));
    
  } catch (error) {
    console.error('Clothes API error:', error);
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
    
    const cloth = new Cloth(clothData);
    await cloth.save();
    
    return NextResponse.json({ ...cloth.toObject(), basePath: basePath }, { status: 201 });
    
  } catch (error) {
    console.error('Create cloth error:', error);
    return NextResponse.json(
      { message: 'Failed to create cloth item', basePath: basePath },
      { status: 500 }
    );
  }
}