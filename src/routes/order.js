import express from "express";
import {
  addOrder,
  deleteOrder,
  getOrder,
  getOrders,
  getOrdersByProductID,
  getOrdersByUserId,
  updateOrder,
} from "../controllers/order.js";
import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

//router.get("/allorders",verifyAdmin,getOrders);

router.get("/allorders", verifyAdmin, getOrders);

router.get("/:id", getOrder);

router.post("/", addOrder);

//router.delete("/:id",verifyAdmin,deleteOrder);
router.get("/user/:id", getOrdersByUserId);
router.get("/product/:_id", getOrdersByProductID);
router.delete("/:id", deleteOrder);

router.put("/:id", updateOrder);

export default router;
