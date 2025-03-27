import express from "express";
import { createPost, getAllPosts } from "../controllers/postController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post('/create', upload.single("image"), createPost);
router.get('/all', getAllPosts);

export default router;