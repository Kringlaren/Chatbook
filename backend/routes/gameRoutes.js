import express from "express";
import { saveHighscore, getAllHighscores, getPersonalBest } from "../controllers/gameController.js";

const router = express.Router();

router.post('/save-score', saveHighscore);
router.get('/scoreboard', getAllHighscores);
router.get('/pb', getPersonalBest);

export default router;