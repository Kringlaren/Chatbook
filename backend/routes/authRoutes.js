import express from "express";
import { loginRateLimit } from "../middleware/rateLimit.js";
import { regUser, logInUser, getLoggedInUser, logOutUser } from "../controllers/authController.js";

const router = express.Router();

router.post('/register', loginRateLimit, regUser);
router.post('/login', loginRateLimit, logInUser);
router.get('/me', getLoggedInUser);
router.post('/logout', logOutUser);

export default router;