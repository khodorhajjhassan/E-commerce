import express from "express";
import {
  addShoe,
  decrementQuantity,
  deleteShoe,
  getShoe,
  getShoeadmin,
  getShoes,
  updateShoe,
  uploadImages,
} from "../controllers/shoe.js";
import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

//router.get("/allproducts",verifyAdmin,getShoes);
router.put("/decrement", decrementQuantity);
router.get("/allproducts", getShoes);
router.post("/upload", verifyAdmin, uploadImages);

//router.get("/:id",verifyUser,getShoe);
router.get("/:id", getShoe);
router.get("/q/:id", verifyAdmin, getShoeadmin);
//
router.post("/", verifyAdmin, addShoe);
//router.delete("/:id",verifyAdmin,deleteShoe);
router.delete("/:id", verifyAdmin, deleteShoe);

//router.put("/:id",verifyAdmin,updateShoe);
router.put("/:id", updateShoe);

export default router;
