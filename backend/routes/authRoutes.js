import express from "express";
import { regUser, logInUser } from "../controllers/authController.js";

const router = express.Router();

router.post('/register', regUser);
router.post('/login', logInUser);

export default router;