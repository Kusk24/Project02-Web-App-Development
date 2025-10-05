import mongoose from "mongoose";

const clothSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Tops', 'Bottoms', 'Outerwear', 'Dresses', 'Shoes', 'Accessories']
  },
  sizes: [{
    type: String,
    required: true
  }],
  sale: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviews: {
    type: Number,
    default: 0
  },
  inStock: {
    type: Boolean,
    default: true
  },
  // User-specific fields for peer-to-peer marketplace
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null // null = shop item, ObjectId = user listing
  },
  userName: {
    type: String,
    default: null
  },
  userEmail: {
    type: String,
    default: null
  },
  condition: {
    type: String,
    enum: ['New', 'Like New', 'Good', 'Fair', null],
    default: null // Only for user listings
  },
  brand: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['active', 'sold', 'unlisted', null],
    default: null // null = shop item (always active), others for user listings
  },
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Cloth = mongoose.models.Cloth || mongoose.model("Cloth", clothSchema);

export default Cloth;
