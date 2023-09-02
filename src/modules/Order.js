import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shoe: [
      {
        type: Array,
        required: true,
      },
    ],
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      required: true,
      enum: ["pending", "confirmed", "shipped", "delivered"],
      default: "pending",
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
    country: {
      type: String,
    },
    city: {
      type: String,
    },
    province: {
      type: String,
    },
    building: {
      type: String,
    },
    RefundRequest: {
      type: String,
      enum: ["Not submitted", "submitted", "accepted", "declined"],
      default: "Not submitted",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
