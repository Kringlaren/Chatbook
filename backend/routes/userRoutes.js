import express from "express";
import { getUserByName } from "../controllers/userController.js";

const router = express.Router();

router.get('/:username', getUserByName);

export default router;