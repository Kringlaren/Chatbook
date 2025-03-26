import express from "express";
import { getUser } from "../controllers/authController.js";

const router = express.Router();

router.post('/getuser', getUser);

export default router;