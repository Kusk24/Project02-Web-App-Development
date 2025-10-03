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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Cloth = mongoose.models.Cloth || mongoose.model("Cloth", clothSchema);

export default Cloth;
