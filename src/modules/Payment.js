import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shoe: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shoe",
        required: true,
      },
    ],

    amount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ["pending", "completed"],
      default: "pending",
    },
    stripePaymentIntentId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // Add timestamps option
);

export default mongoose.model("Payment", paymentSchema);
