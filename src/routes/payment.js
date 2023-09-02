import express from "express";
import {
  addPayment,
  completePayment,
  createCheckout,
  createPaymentIntent,
  deletePayment,
  getDelivery,
  getPayment,
  getPayments,
  updatePayment,
} from "../controllers/payment.js";
import { verifyAdmin, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

//router.get("/allpayments",verifyAdmin,getPayments);

router.get("/allpayments", verifyAdmin, getPayments);
router.get("/delivery", getDelivery);
router.get("/:id", verifyUser, getPayment);

router.post("/create-payment-intent", createPaymentIntent);

router.post("/complete-payment", completePayment);
// router.post('/webhook', handleWebhook);
router.post("/paymenCheckout", createCheckout);
router.post("/", addPayment);
//router.delete("/:id",verifyAdmin,deletePayment);

router.delete("/:id", deletePayment);

router.put("/:id", verifyAdmin, updatePayment);

export default router;
