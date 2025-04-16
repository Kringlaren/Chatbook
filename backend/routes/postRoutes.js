import express from "express";
import { createPost, getPostById, getAllPosts, getPostsByUsername, createComment, getCommentsForPost, likeChange } from "../controllers/postController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Inlägg
router.post('/create', upload.single("image"), createPost);
router.get('/all', getAllPosts);
router.get('/by/:username', getPostsByUsername);
router.get('/get/:id', getPostById);

// Kommentarer
router.post('/comment', upload.single("image"), createComment);
router.get('/comments/:id', getCommentsForPost);

// Gillningar
router.post('/like', likeChange);

export default router;