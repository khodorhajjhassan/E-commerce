import express from "express";
import {
  addDelivery,
  deleteDelivery,
  getDeleviryByOrderId,
  getDeliveries,
  getDelivery,
  updateDelivery,
} from "../controllers/delivery.js";

const router = express.Router();

router.get("/alldelivery", getDeliveries);

router.get("/:id", getDelivery);

router.get("/order/:id", getDeleviryByOrderId);

router.post("/", addDelivery);

router.delete("/:id", deleteDelivery);

router.put("/:id", updateDelivery);

export default router;
