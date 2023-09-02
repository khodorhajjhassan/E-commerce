import User from "../modules/User.js";
import { createError } from "../utils/error.js";
import bcrypt from "bcrypt";


export const getUsers = async (req, res, next) => {
  // const token = req.cookies.access_token;

  // console.log(token);
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    //res.status(500).json({ error: "Failed to fetch users" });
    next(await createError(500, err, req, null));
  }
};
export const getUserById = async (req, res, next) => {
  // const token = req.cookies.access_token;

  // console.log(token);
  try {
    const id = req.params.id;
    const users = await User.findById(id);
    res.status(200).json(users);
  } catch (err) {
    //res.status(500).json({ error: "Failed to fetch users" });
    next(await createError(500, err, req, null));
  }
};
export const getWishlistByUserId = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id).populate("wishlist").exec();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const wish = user.wishlist;
    res.status(200).json(wish);
  } catch (err) {
    next(await createError(500, err, req, null));
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user)
      return next(await createError(404, "User not found!", req, null));

    // Exclude the password field from the user object
    const userWithoutPassword = {
      id: user._id,
      title: user.fname + " " + user.lname,
      img: user.profileimg,
      wishlist: user.wishlist,
      info: {
        fullname: user.fname + user.lname,
        email: user.email,
        phone: user.mobilenumber,
        status: user.isVerified ? "verified" : "Not Verified",
      },
      // Add other properties you want to include in the response
      // For example: email, profile picture, etc.
    };

    res.status(200).json(userWithoutPassword);
  } catch (err) {
    // res.status(500).json({ error: "Failed to fetch users" });
    next(await createError(500, err, req, null));
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user)
      return next(await createError(404, "User not found!", req, null));

    res.status(200).json({ message: "User Deleted" });
  } catch (err) {
    next(await createError(500, err, req, null));
  }
};

export const deleteFromWishlist = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const productId = req.params.productId;

    const user = await User.findById(userId);
    if (!user) return next(await createError(404, "User Not found", req, user));

    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);

    await user.save();
    res.status(200).json("Product delete success");
  } catch (err) {
    next(await createError(500, err, req, null));
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const userUpdate = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!userUpdate)
      return next(await createError(404, "User not found!", req, null));

    if (req.body.wishlist) {
      userUpdate.wishlist = req.body.wishlist;
      await userUpdate.save();
    }
    if (req.body.password) {
      try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        userUpdate.password = hash;
        await userUpdate.save();
      } catch (err) {
        return next(await createError(500, 'Password hashing error', req, null));
      }
    }

    res.status(200).json(userUpdate);
  } catch (err) {
    next(await createError(500, err, req, null));
  }
};
