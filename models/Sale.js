import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
    enum: ['paid', 'unpaid', 'cancelled'],
    default: 'unpaid'
  },
  items: [{
    id: String, // Accept MongoDB ObjectId strings
    name: String,
    price: Number,
    quantity: {
      type: Number,
      min: 1
    },
    image: String,
    size: String
  }],
  // Additional fields for order functionality
  paymentProof: {
    type: String,
    default: null
  },
  deliveryEstimate: {
    type: String,
    default: null
  },
  cancellationDeadline: {
    type: String,
    default: null
  },
  userInfo: {
    name: String,
    email: String,
    phone: String,
    address: String
  }
});

// Delete the cached model to force reload with new schema
if (mongoose.models.Sale) {
  delete mongoose.models.Sale;
}

const Sale = mongoose.model("Sale", saleSchema);

export default Sale;
