import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';
import Cloth from '../../../models/Cloth';

export async function GET() {
  try {
    console.log('Testing database connection...');
    await connectDB();
    
    const userCount = await User.countDocuments();
    const clothCount = await Cloth.countDocuments();
    
    return Response.json({ 
      success: true,
      message: 'Database connection successful',
      data: {
        usersCount: userCount,
        clothesCount: clothCount,
        databaseName: 'Project02',
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Database test error:', error);
    return Response.json({ 
      success: false,
      error: error.message,
      details: error.stack
    }, { status: 500 });
  }
}
