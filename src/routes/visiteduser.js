import express from "express";
import {
  addVistedUser,
  deleteVisits,
  getAllVistedUsers,
} from "../controllers/visiteduser.js";

const router = express.Router();

router.post("/track-visited-user", addVistedUser);
router.get("/", getAllVistedUsers);
router.delete("/:id", deleteVisits);
export default router;
