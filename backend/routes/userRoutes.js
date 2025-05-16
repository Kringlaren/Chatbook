import express from "express";
import { getUserByName, changeBanner, changeProfilePic, changeFollowByName, getUserPreferences, changeBio, getFollowedUsersByName, changeColors } from "../controllers/userController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Uppdatera användare
router.post('/change-banner', upload.single("image"), changeBanner);
router.post('/change-profile-pic', upload.single("image"), changeProfilePic);
router.post('/change-bio', changeBio);
router.post('/change-color', changeColors);

// Följningar
router.post('/follow', changeFollowByName);
router.get('/followed-users/:username', getFollowedUsersByName);

// Preferenser
router.get('/preferences', getUserPreferences);

// Användardata
router.get('/get/:username', getUserByName);

export default router;