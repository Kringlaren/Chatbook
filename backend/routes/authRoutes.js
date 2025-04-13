import express from "express";
import { regUser, logInUser, getLoggedInUser } from "../controllers/authController.js";

const router = express.Router();

router.post('/register', regUser);
router.post('/login', logInUser);
router.get('/me', getLoggedInUser);

export default router;