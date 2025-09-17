let clothes = [
  {
    id: 1,
    name: "Classic White T-Shirt",
    price: 29.99,
    originalPrice: 39.99,
    size: "M",
    description:
      "Premium cotton t-shirt with a comfortable fit. Perfect for everyday wear.",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop",
    sale: true,
    category: "Tops",
  },
  {
    id: 2,
    name: "Denim Jacket",
    price: 89.99,
    size: "L",
    description:
      "Classic denim jacket with a modern cut. Made from high-quality denim.",
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop",
    category: "Outerwear",
  },
  {
    id: 3,
    name: "Black Jeans",
    price: 79.99,
    size: "32",
    description:
      "Slim-fit black jeans with stretch for comfort. Perfect for any occasion.",
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop",
    category: "Bottoms",
  },
  {
    id: 4,
    name: "Floral Summer Dress",
    price: 65.99,
    originalPrice: 85.99,
    size: "S",
    description:
      "Light and airy floral dress perfect for summer days. Made from breathable fabric.",
    image:
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop",
    sale: true,
    category: "Dresses",
  },
  {
    id: 5,
    name: "Casual Hoodie",
    price: 54.99,
    size: "XL",
    description:
      "Comfortable hoodie with a relaxed fit. Perfect for casual outings.",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop",
    category: "Tops",
  },
  {
    id: 6,
    name: "Leather Boots",
    price: 149.99,
    size: "10",
    description:
      "Premium leather boots with a classic design. Durable and stylish.",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop",
    category: "Shoes",
  },
  {
    id: 7,
    name: "Striped Blouse",
    price: 45.99,
    size: "M",
    description:
      "Elegant striped blouse perfect for office wear. Made from premium materials.",
    image:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop",
    category: "Tops",
  },
  {
    id: 8,
    name: "Wool Sweater",
    price: 95.99,
    originalPrice: 120.99,
    size: "L",
    description:
      "Warm wool sweater with a classic design. Perfect for winter months.",
    image:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=500&fit=crop",
    sale: true,
    category: "Tops",
  },
];

export async function GET() {
  return Response.json(clothes);
}

export async function POST(req) {
  const body = await req.json();
  const newClothes = { id: clothes.length + 1, ...body };
  clothes.push(newClothes);
  return Response.json(newClothes);
}
