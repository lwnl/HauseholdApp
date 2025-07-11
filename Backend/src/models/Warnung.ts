import mongoose from "mongoose";

const WarnungSchema = new mongoose.Schema({
  isDeleted: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["low_stock", "expiring_soon", "expired", "manual"],
    default: "manual",
  },
  priority: {
    type: String,
    enum: ["high", "medium", "low"],
    default: "medium",
  },
  status: {
    type: String,
    enum: ["active", "resolved"],
    default: "active",
  },
  relatedItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lebensmittel",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Warnung", WarnungSchema);
