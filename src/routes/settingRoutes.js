import express from "express";
import multer from "multer";
import path from "path";
import {
  getLogo,
  uploadLogo,
  deleteLogo,
  getSocialMediaLinks,
  updateSocialMediaLinks,
  getContactInfo,
  updateContactInfo,
} from "../controllers/setting.js";

const router = express.Router();

router.get("/logo", getLogo);
router.put("/upload", uploadLogo);
router.delete("/logo", deleteLogo);
router.get("/socialMediaLinks", getSocialMediaLinks);
router.put("/socialMediaLinks", updateSocialMediaLinks);
router.get("/contact", getContactInfo);
router.put("/contact", updateContactInfo);
export default router;
