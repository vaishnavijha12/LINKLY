import mongoose from "mongoose";

const shortUrlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
    index: { unique: true },// Ensure shortUrl is unique//index??
  },
  clicks: {
    type: Number,
    default: 0,
  },
  tags: {
    type: [String],
    default: [],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  redirectType: {
    type: String,
    enum: ["301", "302"],
    default: "302",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, { timestamps: true });

export default mongoose.model("ShortUrl", shortUrlSchema);