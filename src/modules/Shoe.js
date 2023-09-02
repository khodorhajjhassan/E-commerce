import mongoose from "mongoose";

const shoeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    color: [
      {
        colorName: {
          type: String,
          required: true,
        },
        sizes: {
          type: [
            {
              size: {
                type: Number,
                required: true,
              },
              quantity: {
                type: Number,
                required: true,
                default: 0,
              },
            },
          ],
          required: true,
          validate: {
            validator: (array) => array.length > 0, // Add a validation to ensure it has at least one size
            message: "At least one size must be provided for each color.",
          },
        },
      },
    ],
    producer: {
      type: String,
      required: true,
    },
    productimg: {
      type: Array, // Change the type to Array
      required: true,
      validate: {
        validator: (array) => array.length === 3, // Add a validation to ensure it has exactly 3 elements
        message: "The product image array must have exactly 3 elements.",
      },
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: Array,
    },
    subcategory: {
      type: String,
      required: true,
    },
    subsubcategory: {
      type: String,
    },
    isStock: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Shoe", shoeSchema);
