import connectDB from '../../../lib/mongodb';
import Cloth from '../../../models/Cloth';

const sampleClothes = [
  {
    name: "Classic White T-Shirt",
    price: 29.99,
    originalPrice: 39.99,
    description: "Premium cotton t-shirt with a comfortable fit. Perfect for everyday wear.",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop",
    category: "Tops",
    sizes: ["XS", "S", "M", "L", "XL"],
    sale: true,
    rating: 4.5,
    reviews: 128
  },
  {
    name: "Denim Jacket",
    price: 89.99,
    description: "Classic denim jacket with a modern cut. Made from high-quality denim.",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop",
    category: "Outerwear",
    sizes: ["S", "M", "L", "XL"],
    rating: 4.8,
    reviews: 95
  },
  {
    name: "Black Jeans",
    price: 79.99,
    description: "Slim-fit black jeans with stretch for comfort and style.",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop",
    category: "Bottoms",
    sizes: ["28", "30", "32", "34", "36"],
    rating: 4.3,
    reviews: 210
  },
  {
    name: "Floral Summer Dress",
    price: 65.99,
    originalPrice: 85.99,
    description: "Light and airy floral dress perfect for summer days.",
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop",
    category: "Dresses",
    sizes: ["XS", "S", "M", "L"],
    sale: true,
    rating: 4.7,
    reviews: 156
  },
  {
    name: "Wool Sweater",
    price: 120.00,
    description: "Cozy wool sweater for cold weather. Premium merino wool blend.",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=500&fit=crop",
    category: "Tops",
    sizes: ["S", "M", "L", "XL"],
    rating: 4.6,
    reviews: 89
  },
  {
    name: "Running Shoes",
    price: 149.99,
    description: "High-performance running shoes with advanced cushioning.",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop",
    category: "Shoes",
    sizes: ["7", "8", "9", "10", "11", "12"],
    rating: 4.9,
    reviews: 342
  }
];

export async function POST() {
  try {
    await connectDB();
    
    // Clear existing data
    await Cloth.deleteMany({});
    
    // Insert sample data
    const insertedClothes = await Cloth.insertMany(sampleClothes);
    
    return Response.json({ 
      message: `Successfully seeded ${insertedClothes.length} clothes`,
      data: insertedClothes 
    });
  } catch (error) {
    console.error('Seeding error:', error);
    return Response.json({ error: 'Failed to seed database' }, { status: 500 });
  }
}
