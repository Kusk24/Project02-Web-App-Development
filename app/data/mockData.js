// This file is no longer needed - using MongoDB instead
//   "user1": {
//     id: "user1",
//     email: "john@example.com",
//     password: "password123",
//     name: "John Doe",
//     phone: "+1234567890",
//     address: "123 Main St, City, State",
//     joinDate: "2024-01-15"
//   }
// };

export const mockOrders = {
  "user1": [
    {
      id: "order1",
      date: "2024-01-20",
      total: 89.99,
      status: "delivered",
      paymentStatus: "paid",
      paymentProof: "proof_12345.jpg",
      items: [
        { id: 1, name: "Classic T-Shirt", price: 29.99, quantity: 1, image: "https://via.placeholder.com/100" },
        { id: 2, name: "Denim Jeans", price: 59.99, quantity: 1, image: "https://via.placeholder.com/100" }
      ]
    },
    {
      id: "order2", 
      date: "2024-01-25",
      total: 149.98,
      status: "shipped",
      paymentStatus: "unpaid",
      paymentProof: null,
      items: [
        { id: 3, name: "Leather Jacket", price: 149.98, quantity: 1, image: "https://via.placeholder.com/100" }
      ]
    }
  ]
};

export const mockProducts = [
  { id: 1, name: "Classic T-Shirt", price: 29.99, image: "/api/placeholder/200/200" },
  { id: 2, name: "Denim Jeans", price: 59.99, image: "/api/placeholder/200/200" },
  { id: 3, name: "Leather Jacket", price: 149.98, image: "/api/placeholder/200/200" }
];
