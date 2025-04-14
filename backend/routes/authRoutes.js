import express from "express";
import { regUser, logInUser, getLoggedInUser, logOutUser } from "../controllers/authController.js";

const router = express.Router();

router.post('/register', regUser);
router.post('/login', logInUser);
router.get('/me', getLoggedInUser);
router.post('/logout', logOutUser);

export default router;