import express from "express";
import { regUser, logInUser } from "../controllers/userController.js";

const router = express.Router();

router.post('/register', regUser);
router.post('/login', logInUser);

export default router;