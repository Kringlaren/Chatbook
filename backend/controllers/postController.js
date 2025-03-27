import db from '../db.js';
import codes from '../httpCodes.js';

// Hämtar alla inlägg från databasen
export const getAllPosts = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM posts");

        res.status(codes.OK).json(rows);
    } catch (error) {
        res.status(codes.SERVER_ERROR).json({ message: "Serverfel", error});
    } 
};

// Skapar ett inlägg med eller utan bild
export const createPost = async (req, res) => {
    const { userId, textContent } = req.body;
    console.log(req.body);
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!textContent) return res.status(codes.BAD_REQUEST).json({ message: "Inlägget måste innehålla text!" })

    try {
        await db.query("INSERT INTO posts (user_id, content, image) VALUES (?, ?, ?)", [userId, textContent, imageUrl]);
        res.status(codes.CREATED).json({ message: "Inlägg skapad!" });
    } catch (error) {
        res.status(codes.SERVER_ERROR).json({ message: "Serverfel", error});
    } 
};