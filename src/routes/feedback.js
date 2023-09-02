import express from "express";
import {
  addFeedback,
  checkDuplicateRating,
  deleteFeedback,
  getAverageRatingForShoe,
  getFeedback,
  getFeedbackByUser,
  getFeedbacks,
  updateFeedback,
} from "../controllers/feedback.js";
import { verifyAdmin, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/check", checkDuplicateRating, addFeedback);
// In your routes.js file
router.get("/feedback/:userId/:orderId", getFeedbackByUser);

router.get("/allfeedback", verifyAdmin, getFeedbacks);

router.get("/:id", verifyUser, getFeedback);

//router.post("/",verifyAdmin,addFeedback);
router.post("/", addFeedback);
router.delete("/:id", verifyAdmin, deleteFeedback);

router.put("/:id", verifyAdmin, updateFeedback);
router.get("/averagefeedback/:shoeId", getAverageRatingForShoe);

export default router;
