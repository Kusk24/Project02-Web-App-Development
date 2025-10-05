import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Cloth from '../../../models/Cloth';
import User from '../../../models/User';

// This endpoint fixes existing cloth items with null userName/userEmail
export async function POST(request) {
  try {
    await connectDB();
    
    // Find all user listings with null userName
    const clothesWithNullUserName = await Cloth.find({
      user: { $ne: null },
      userName: null
    });

    console.log(`🔧 Found ${clothesWithNullUserName.length} items to fix`);
    
    let fixed = 0;
    for (const cloth of clothesWithNullUserName) {
      try {
        // Get the user details
        const user = await User.findById(cloth.user);
        if (user) {
          cloth.userName = user.name;
          cloth.userEmail = user.email;
          await cloth.save();
          console.log(`✅ Fixed cloth ${cloth._id}: ${cloth.name} - Added user: ${user.name}`);
          fixed++;
        }
      } catch (err) {
        console.error(`❌ Error fixing cloth ${cloth._id}:`, err);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Fixed ${fixed} out of ${clothesWithNullUserName.length} items`,
      fixed,
      total: clothesWithNullUserName.length
    });
  } catch (error) {
    console.error('Fix usernames error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
