import express from "express";
import { loginRateLimit } from "../middleware/rateLimit.js";
import { regUser, logInUser, getLoggedInUser, logOutUser } from "../controllers/authController.js";

const router = express.Router();

router.post('/register', loginRateLimit, regUser);
router.post('/login', loginRateLimit, logInUser);
router.post('/logout', logOutUser);

router.get('/me', getLoggedInUser);

export default router;