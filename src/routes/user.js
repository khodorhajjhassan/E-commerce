import express from "express";
import {
  deleteFromWishlist,
  deleteUser,
  getUser,
  getUserById,
  getUsers,
  getWishlistByUserId,
  updateUser,
} from "../controllers/user.js";
import { verifyAdmin, verifyToken, verifyUser } from "../utils/verifyToken.js";
const router = express.Router();

router.get("/checkuser/:id", verifyUser, (req, res, next) => {
  res.send("You are Authorized to delete your account");
});

router.get("/details/:id", getUserById);

router.get("/checkadmin/:id", verifyAdmin, (req, res, next) => {
  res.send("You are Authorized to delete All accounts");
});

router.get("/checkauthenticon", verifyToken, (req, res, next) => {
  res.send("You are Logged In");
});
router.get("/allusers", verifyAdmin, getUsers);

router.get("/:id", getUser);

//router.delete("/:id",verifyUser,deleteUser);
router.delete("/:id", verifyUser, deleteUser);

router.put("/:id", updateUser);
router.get("/wishlist/:id", getWishlistByUserId);
router.delete("/:userId/:productId", deleteFromWishlist);

/*
   sample data..be careful email is unique
   {
  "clientId": "abc123",
  "fname": "John",
  "lname": "Doe",
  "email": "johndo1e@example.com",
  "password": "secretpassword",
  "mobilenumber": "1234567890",
  "gender": "Male",
  "birthday": "1990-01-01",
  "country": "United States",
  "province": "California",
  "city": "Los Angeles",
  "street": "123 Main St",
  "building": "Building A",
}
  */

export default router;
