import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';
import Cloth from '../../../models/Cloth';

export async function POST() {
  try {
    console.log('Starting database seeding...');
    await connectDB();
    
    // Clear existing data
    await User.deleteMany({});
    await Cloth.deleteMany({});
    console.log('Cleared existing data');
    
    // Sample users data
    const sampleUsers = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        phone: '+1234567890',
        address: '123 Main St, City, State'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        phone: '+1987654321',
        address: '456 Oak Ave, City, State'
      },
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        phone: '+1555000000',
        address: '789 Admin Blvd, City, State'
      }
    ];
    
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
    
    // Create users and clothes
    const createdUsers = await User.create(sampleUsers);
    const createdClothes = await Cloth.create(sampleClothes);
    
    console.log(`Created ${createdUsers.length} users and ${createdClothes.length} clothes`);
    
    return Response.json({ 
      success: true,
      message: 'Database seeded successfully',
      data: {
        usersCreated: createdUsers.length,
        clothesCreated: createdClothes.length,
        users: createdUsers.map(u => ({ id: u._id, name: u.name, email: u.email })),
        clothes: createdClothes.map(c => ({ id: c._id, name: c.name, category: c.category }))
      }
    });
    
  } catch (error) {
    console.error('Seeding error:', error);
    return Response.json({ 
      success: false,
      error: error.message,
      details: error.stack
    }, { status: 500 });
  }
}
