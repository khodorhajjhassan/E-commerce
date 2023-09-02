import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
      required: true,
    },
    lname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    emailToken: {
      type: String,
    },
    mobilenumber: {
      type: String,
    },
    profileimg: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    birthday: {
      type: Date,
      validate: {
        validator: function (value) {
          return value < new Date();
        },
        message: (props) => `${props.value} is not a valid birthday!`,
      },
    },
    country: {
      type: String,
    },
    province: {
      type: String,
    },
    city: {
      type: String,
    },
    street: {
      type: String,
    },
    building: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isDelivery: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shoe",
        unique: true,
      },
    ],
  },
  { timestamps: true } // Add timestamps option
);

export default mongoose.model("User", userSchema);
