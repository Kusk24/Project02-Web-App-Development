import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';
import Cloth from '../../../models/Cloth';

export async function GET(req) {
  const basePath = process.env.NEXT_PUBLIC_API_URL || '';
  
  try {
    await connectDB();
    
    // Clear existing data
    await User.deleteMany({});
    
    // Sample users data
    const sampleUsers = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        phone: '+1234567890',
        address: '123 Main St, City, State',
        joinDate: new Date()
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        phone: '+1987654321',
        address: '456 Oak Ave, City, State',
        joinDate: new Date()
      },
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        phone: '+1555000000',
        address: '789 Admin Blvd, City, State',
        joinDate: new Date()
      }
    ];
    
    // Create users
    const createdUsers = await User.create(sampleUsers);
    
    return Response.json({ 
      message: 'Database seeded successfully',
      usersCreated: createdUsers.length,
      basePath: basePath
    });
    
  } catch (error) {
    console.error('Seed error:', error);
    return Response.json({ 
      error: 'Failed to seed database',
      basePath: basePath
    }, { status: 500 });
  }
}

export async function POST() {
  const basePath = process.env.NEXT_PUBLIC_API_URL || '';
  
  try {
    await connectDB();
    
    // Clear existing data
    await Cloth.deleteMany({});
    
    // Sample clothes data
    const sampleClothes = [
      {
        name: "Classic White T-Shirt",
        price: 29.99,
        originalPrice: 39.99,
        description: "Premium cotton blend white t-shirt perfect for everyday wear",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
        category: "Tops",
        sizes: ["XS", "S", "M", "L", "XL"],
        sale: true,
        rating: 4.5,
        reviews: 128,
        inStock: true
      },
      {
        name: "Denim Jeans",
        price: 79.99,
        description: "Classic blue denim jeans with a comfortable fit",
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500",
        category: "Bottoms",
        sizes: ["28", "30", "32", "34", "36"],
        sale: false,
        rating: 4.2,
        reviews: 85,
        inStock: true
      },
      {
        name: "Winter Coat",
        price: 149.99,
        originalPrice: 199.99,
        description: "Warm winter coat with water-resistant fabric",
        image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=500",
        category: "Outerwear",
        sizes: ["S", "M", "L", "XL"],
        sale: true,
        rating: 4.8,
        reviews: 156,
        inStock: true
      },
      {
        name: "Summer Dress",
        price: 59.99,
        description: "Light and breezy summer dress perfect for warm weather",
        image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500",
        category: "Dresses",
        sizes: ["XS", "S", "M", "L"],
        sale: false,
        rating: 4.6,
        reviews: 92,
        inStock: true
      },
      {
        name: "Running Shoes",
        price: 99.99,
        description: "Comfortable running shoes with excellent support",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
        category: "Shoes",
        sizes: ["7", "8", "9", "10", "11", "12"],
        sale: false,
        rating: 4.4,
        reviews: 203,
        inStock: true
      },
      {
        name: "Leather Handbag",
        price: 89.99,
        originalPrice: 119.99,
        description: "Elegant leather handbag with multiple compartments",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
        category: "Accessories",
        sizes: ["One Size"],
        sale: true,
        rating: 4.7,
        reviews: 74,
        inStock: true
      }
    ];
    
    // Insert sample data
    const insertedClothes = await Cloth.insertMany(sampleClothes);
    
    return Response.json({ 
      message: `Successfully seeded ${insertedClothes.length} clothes`,
      data: insertedClothes,
      basePath: basePath
    });
  } catch (error) {
    console.error('Seeding error:', error);
    return Response.json({ 
      error: 'Failed to seed database',
      basePath: basePath
    }, { status: 500 });
  }
}
