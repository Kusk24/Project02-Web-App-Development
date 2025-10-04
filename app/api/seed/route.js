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
  try {
    await connectDB();
    await Cloth.deleteMany({});

    const sampleClothes = [
      // TOPS
      {
        name: "Classic White T-Shirt",
        price: 29,
        originalPrice: 35,
        description: "Premium cotton white t-shirt perfect for everyday wear",
        image: "https://i.pinimg.com/1200x/ec/68/60/ec68602dce97c0be4a08babc6466e2b8.jpg",
        category: "Tops",
        sizes: ["XS", "S", "M", "L", "XL"],
        sale: true,
        rating: 4.5,
        reviews: 128,
        inStock: true,
      },
      {
        name: "Striped Polo Shirt",
        price: 39,
        originalPrice: 45,
        description: "Casual striped polo shirt with a modern cut",
        image: "https://i.pinimg.com/1200x/b2/9d/10/b29d105ab0c854e7d1d7021ef42efb8c.jpg",
        category: "Tops",
        sizes: ["S", "M", "L", "XL"],
        sale: false,
        rating: 4.3,
        reviews: 65,
        inStock: true,
      },
      {
        name: "Black Hoodie",
        price: 59,
        originalPrice: 75,
        description: "Cozy fleece-lined black hoodie",
        image: "https://i.pinimg.com/1200x/d4/ac/d4/d4acd4a24558253a97f2717e3e9ccd2a.jpg",
        category: "Tops",
        sizes: ["M", "L", "XL"],
        sale: false,
        rating: 4.6,
        reviews: 144,
        inStock: true,
      },
      {
        name: "Graphic Tee",
        price: 24,
        originalPrice: 32,
        description: "Trendy graphic tee with soft fabric",
        image: "https://i.pinimg.com/1200x/9c/0b/f0/9c0bf02d22e825a227af5b4e7f8f568e.jpg",
        category: "Tops",
        sizes: ["S", "M", "L", "XL"],
        sale: true,
        rating: 4.2,
        reviews: 190,
        inStock: true,
      },
      {
        name: "Wool Sweater",
        price: 99,
        originalPrice: 120,
        description: "Warm merino wool sweater for colder days",
        image: "https://i.pinimg.com/1200x/d5/1e/e1/d51ee192cc4ea0bf51850c2a3dfb5c16.jpg",
        category: "Tops",
        sizes: ["M", "L", "XL"],
        sale: false,
        rating: 4.6,
        reviews: 156,
        inStock: true,
      },

      // BOTTOMS
      {
        name: "Denim Jeans",
        price: 79,
        originalPrice: 95,
        description: "Classic blue denim straight fit jeans",
        image: "https://i.pinimg.com/1200x/14/65/bc/1465bc6073d4c55e1149d689becf4abe.jpg",
        category: "Bottoms",
        sizes: ["28", "30", "32", "34", "36"],
        sale: false,
        rating: 4.2,
        reviews: 85,
        inStock: true,
      },
      {
        name: "Slim Fit Chinos",
        price: 69,
        originalPrice: 85,
        description: "Versatile slim fit chinos",
        image: "https://i.pinimg.com/1200x/2c/9a/7b/2c9a7b5b0ad781499518d73f8ba67ccb.jpg",
        category: "Bottoms",
        sizes: ["30", "32", "34", "36"],
        sale: true,
        rating: 4.5,
        reviews: 88,
        inStock: true,
      },
      {
        name: "Cargo Pants",
        price: 74,
        originalPrice: 89,
        description: "Utility cargo pants with side pockets",
        image: "https://i.pinimg.com/1200x/60/a1/56/60a15623154d476ab7aaed694658ca7e.jpg",
        category: "Bottoms",
        sizes: ["30", "32", "34", "36"],
        sale: false,
        rating: 4.1,
        reviews: 54,
        inStock: true,
      },
      {
        name: "Leggings",
        price: 39,
        originalPrice: 49,
        description: "Black stretch leggings for casual or gym",
        image: "https://i.pinimg.com/1200x/d4/e6/f7/d4e6f7b8d7422c354f1ff8bcf82125ce.jpg",
        category: "Bottoms",
        sizes: ["S", "M", "L"],
        sale: true,
        rating: 4.5,
        reviews: 210,
        inStock: true,
      },
      {
        name: "Mini Skirt",
        price: 44,
        originalPrice: 55,
        description: "A-line mini skirt with clean design",
        image: "https://i.pinimg.com/736x/01/d5/29/01d5298a944a6f720b47da10ad153745.jpg",
        category: "Bottoms",
        sizes: ["S", "M", "L"],
        sale: false,
        rating: 4.4,
        reviews: 72,
        inStock: true,
      },

      // OUTERWEAR
      {
        name: "Winter Coat",
        price: 149,
        originalPrice: 180,
        description: "Insulated winter coat with hood",
        image: "https://i.pinimg.com/736x/ae/c0/47/aec04735f4f9246307d73c0295ec18ec.jpg",
        category: "Outerwear",
        sizes: ["S", "M", "L", "XL"],
        sale: true,
        rating: 4.8,
        reviews: 156,
        inStock: true,
      },
      {
        name: "Denim Jacket",
        price: 109,
        originalPrice: 130,
        description: "Classic denim trucker jacket",
        image: "https://i.pinimg.com/1200x/a1/53/05/a1530552d7ed00a614e2c2b9a5c033d0.jpg",
        category: "Outerwear",
        sizes: ["S", "M", "L", "XL"],
        sale: false,
        rating: 4.7,
        reviews: 98,
        inStock: true,
      },
      {
        name: "Puffer Jacket",
        price: 159,
        originalPrice: 190,
        description: "Lightweight puffer jacket",
        image: "https://i.pinimg.com/1200x/46/82/d0/4682d0c9ea734faecd196ea590cf8c53.jpg",
        category: "Outerwear",
        sizes: ["M", "L", "XL"],
        sale: false,
        rating: 4.9,
        reviews: 182,
        inStock: true,
      },
      {
        name: "Raincoat",
        price: 119,
        originalPrice: 140,
        description: "Waterproof raincoat with hood",
        image: "https://i.pinimg.com/736x/f3/35/53/f3355393613c5a9e8f13a24287b9307e.jpg",
        category: "Outerwear",
        sizes: ["M", "L", "XL"],
        sale: false,
        rating: 4.7,
        reviews: 66,
        inStock: true,
      },
      {
        name: "Blazer",
        price: 159,
        originalPrice: 200,
        description: "Tailored formal blazer",
        image: "https://i.pinimg.com/1200x/75/44/aa/7544aa619f62cb4c922150b8fd3de305.jpg",
        category: "Outerwear",
        sizes: ["M", "L", "XL"],
        sale: false,
        rating: 4.8,
        reviews: 88,
        inStock: true,
      },
      {
        name: "Sherpa Jacket",
        price: 129,
        originalPrice: 150,
        description: "Warm sherpa lined jacket",
        image: "https://i.pinimg.com/736x/fe/e8/46/fee846bc5b53e9d6164d38ea275f28bb.jpg",
        category: "Outerwear",
        sizes: ["S", "M", "L", "XL"],
        sale: false,
        rating: 4.6,
        reviews: 73,
        inStock: true,
      },

      // DRESSES
      {
        name: "Summer Dress",
        price: 59,
        originalPrice: 75,
        description: "Floral summer dress",
        image: "https://i.pinimg.com/1200x/34/d8/43/34d843a80b535551b7d770590acb7a5f.jpg",
        category: "Dresses",
        sizes: ["XS", "S", "M", "L"],
        sale: false,
        rating: 4.6,
        reviews: 92,
        inStock: true,
      },
      {
        name: "Cocktail Dress",
        price: 129,
        originalPrice: 160,
        description: "Elegant cocktail dress",
        image: "https://i.pinimg.com/736x/ac/c1/ed/acc1ed9eee8c2a6ef157cb07084fa9a9.jpg",
        category: "Dresses",
        sizes: ["S", "M", "L"],
        sale: false,
        rating: 4.8,
        reviews: 101,
        inStock: true,
      },
      {
        name: "Maxi Dress",
        price: 89,
        originalPrice: 110,
        description: "Long maxi dress with floral print",
        image: "https://i.pinimg.com/1200x/aa/67/27/aa6727992853401367eed1faf8347f79.jpg",
        category: "Dresses",
        sizes: ["S", "M", "L", "XL"],
        sale: true,
        rating: 4.4,
        reviews: 76,
        inStock: true,
      },
      {
        name: "Sweater Dress",
        price: 99,
        originalPrice: 120,
        description: "Cozy knit sweater dress",
        image: "https://i.pinimg.com/1200x/c6/58/75/c658755c7d7ad1b5f871a3891231763d.jpg",
        category: "Dresses",
        sizes: ["S", "M", "L"],
        sale: false,
        rating: 4.5,
        reviews: 58,
        inStock: true,
      },

      // SHOES
      {
        name: "Running Shoes",
        price: 99,
        originalPrice: 130,
        description: "Breathable running shoes",
        image: "https://i.pinimg.com/736x/d1/03/df/d103df1456a13060c69c970b4124dd23.jpg",
        category: "Shoes",
        sizes: ["7", "8", "9", "10", "11"],
        sale: false,
        rating: 4.4,
        reviews: 203,
        inStock: true,
      },
      {
        name: "Sneakers",
        price: 79,
        originalPrice: 95,
        description: "Everyday sneakers",
        image: "https://i.pinimg.com/1200x/5b/c6/d4/5bc6d4e07aa10b5aaa3a674f3443d110.jpg",
        category: "Shoes",
        sizes: ["7", "8", "9", "10", "11"],
        sale: false,
        rating: 4.5,
        reviews: 210,
        inStock: true,
      },
      {
        name: "Formal Leather Shoes",
        price: 139,
        originalPrice: 170,
        description: "Polished black oxford leather shoes",
        image: "https://i.pinimg.com/736x/90/e5/83/90e5836b77244e37d5c8a2bcdda17312.jpg",
        category: "Shoes",
        sizes: ["7", "8", "9", "10", "11"],
        sale: false,
        rating: 4.7,
        reviews: 112,
        inStock: true,
      },

      // ACCESSORIES
      {
        name: "Leather Handbag",
        price: 89,
        originalPrice: 119,
        description: "Stylish leather handbag",
        image: "https://i.pinimg.com/1200x/f2/70/fc/f270fc7eed71b79c95843d0caffc7b0a.jpg",
        category: "Accessories",
        sizes: ["One Size"],
        sale: true,
        rating: 4.7,
        reviews: 74,
        inStock: true,
      },
      {
        name: "Backpack",
        price: 69,
        originalPrice: 90,
        description: "Durable everyday backpack",
        image: "https://i.pinimg.com/1200x/56/b2/2b/56b22b6edb92ddd53779ca831b98b026.jpg",
        category: "Accessories",
        sizes: ["One Size"],
        sale: false,
        rating: 4.6,
        reviews: 132,
        inStock: true,
      },
      {
        name: "Wool Scarf",
        price: 29,
        originalPrice: 40,
        description: "Soft wool scarf",
        image: "https://i.pinimg.com/1200x/7c/28/67/7c286757d57737483b8d32cf0bd14e8e.jpg",
        category: "Accessories",
        sizes: ["One Size"],
        sale: false,
        rating: 4.3,
        reviews: 43,
        inStock: true,
      },
    ];

    const insertedClothes = await Cloth.insertMany(sampleClothes);

    return new Response(
      JSON.stringify({
        message: `Seeded ${insertedClothes.length} products (Pinterest hardcoded)`,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Seeding error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to seed database" }),
      { status: 500 }
    );
  }
}