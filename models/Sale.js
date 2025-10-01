import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  items: [{
    id: Number,
    name: String,
    price: Number,
    quantity: {
      type: Number,
      min: 1
    },
    image: String
  }]
});

const Sale = mongoose.models.sale || mongoose.model("sale", saleSchema);

export default Sale;
