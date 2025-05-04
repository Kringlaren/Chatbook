import express from "express";
import { getUserByName, changeBanner, changeProfilePic, changeFollowByName, getUserPreferences, changeBio, getFollowedUsers, changeColors } from "../controllers/userController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post('/change-banner', upload.single("image"), changeBanner);
router.post('/change-profile-pic', upload.single("image"), changeProfilePic);
router.post('/change-bio', changeBio);
router.post('/change-color', changeColors);

router.post('/follow', changeFollowByName);
router.get('/followed-users', getFollowedUsers);

router.get('/preferences', getUserPreferences);

router.get('/get/:username', getUserByName);

export default router;