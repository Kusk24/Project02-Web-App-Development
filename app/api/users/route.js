import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

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

// UPDATE user profile (PATCH)
export async function PATCH(req) {
  try {
    await connectDB();
    
    // Get user from token
    const userToken = getUserFromToken(req);
    if (!userToken) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, phone, address, currentPassword, newPassword } = body;

    // Find user
    const user = await User.findById(userToken.userId);
    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    // If changing password, verify current password
    if (newPassword) {
      if (!currentPassword) {
        return Response.json({ error: 'Current password required to change password' }, { status: 400 });
      }

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return Response.json({ error: 'Current password is incorrect' }, { status: 400 });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    // Update other fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    await user.save();

    // Return updated user (without password)
    const updatedUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      joinDate: user.joinDate,
    };

    return Response.json({ 
      message: 'Profile updated successfully',
      user: updatedUser 
    });
  } catch (error) {
    console.error('Error updating user:', error);
    
    // Handle duplicate email error
    if (error.code === 11000) {
      return Response.json({ error: 'Email already exists' }, { status: 400 });
    }
    
    return Response.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}

// DELETE user account
export async function DELETE(req) {
  try {
    await connectDB();
    
    // Get user from token
    const userToken = getUserFromToken(req);
    if (!userToken) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find and delete user
    const deletedUser = await User.findByIdAndDelete(userToken.userId);
    if (!deletedUser) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    // Clear auth cookie
    const response = Response.json({ 
      message: 'Account deleted successfully' 
    });
    
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error deleting user:', error);
    return Response.json({ error: 'Failed to delete account' }, { status: 500 });
  }
}
