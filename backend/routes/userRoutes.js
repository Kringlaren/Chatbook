import express from "express";
import { getUserByName, changeBanner, changeProfilePic } from "../controllers/userController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get('/:username', getUserByName);
router.post('/change-banner', upload.single("image"), changeBanner);
router.post('/change-profile-pic', upload.single("image"), changeProfilePic);

export default router;