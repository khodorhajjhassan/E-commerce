import express from "express";
import {
  ViewMails,
  addToMailingList,
} from "../controllers/addToMailingListController.js";

const router = express.Router();
router.post("/signup", addToMailingList);
router.get("/", ViewMails);

export default router;
