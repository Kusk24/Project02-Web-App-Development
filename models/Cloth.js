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
  image: String
});

const Cloth = mongoose.models.cloth || mongoose.model("cloth", clothSchema);

export default Cloth;
