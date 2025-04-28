import express from "express";
import { getUserByName, changeBanner, changeProfilePic, followUserByName, getUserPreferences } from "../controllers/userController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post('/change-banner', upload.single("image"), changeBanner);
router.post('/change-profile-pic', upload.single("image"), changeProfilePic);
router.post('/follow', followUserByName);
router.get('/preferences', getUserPreferences);
router.get('/get/:username', getUserByName);

export default router;