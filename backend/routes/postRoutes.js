import express from "express";
import { createPost, getPost, getAllPosts, createComment, getCommentsForPost } from "../controllers/postController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Inlägg
router.get('/:id', getPost);
router.post('/create', upload.single("image"), createPost);
router.get('/all', getAllPosts);

// Kommentarer
router.post('/comment', upload.single("image"), createComment);
router.get('/comments', getCommentsForPost);

export default router;