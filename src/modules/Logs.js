import mongoose from "mongoose";

const logsSchema = new mongoose.Schema(
  {
    status: {
      type: Number,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    deviceType: {
      type: String,
      required: true,
    },
    operatingSystem: {
      type: String,
      required: true,
    },
    browser: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to your existing User model
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "Logs" } // Optional: specify the collection name for MongoDB
);

export default mongoose.model("Logs", logsSchema);
