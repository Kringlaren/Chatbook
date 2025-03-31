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

// Hämtar ett inlägg med id
export const getPost = async (req, res) => {
    const id = req.params.id;
    try {
        const row = await db.query("SELECT * FROM posts WHERE id=?", [id]);
        res.status(codes.OK).json(row);
    } catch (error) {
        res.status(codes.SERVER_ERROR).json({ message: "Serverfel", error});
    } 
};

// Skapar ett inlägg med eller utan bild
export const createPost = async (req, res) => {
    const userId = req.body;
    const textContent = checkTextContent(req, res);

    if (!textContent) return;

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        await db.query("INSERT INTO posts (user_id, content, image) VALUES (?, ?, ?)", [userId, textContent, imageUrl]);
        res.status(codes.CREATED).json({ message: "Inlägg skapad!" });
    } catch (error) {
        res.status(codes.SERVER_ERROR).json({ message: "Serverfel", error});
    } 
};


// Kommentarer  //
//////////////////

// Skapar kommentar på ett inlägg med eller utan bild
export const createComment = async (req, res) => {
    const { userId, postId } = req.body;
    const textContent = checkTextContent(req, res);

    if (!textContent) return;

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        await db.query("INSERT INTO comments (user_id, post_id, content, image) VALUES (?, ?, ?, ?)", [userId, postId, textContent, imageUrl]);
        res.status(codes.CREATED).json({ message: "Kommentar skapad!" });
    } catch (error) {
        res.status(codes.SERVER_ERROR).json({ message: "Serverfel", error});
    } 
}

// Hämtar alla kommentarer för ett visst inlägg
export const getCommentsForPost = async (req, res) => {
    const { postId } = req.body;

    try {
        const [rows] = await db.query("SELECT * FROM comments WHERE post_id=?", [postId]);
        res.status(codes.OK).json(rows);
        
    } catch (error) {
        res.status(codes.SERVER_ERROR).json({ message: "Serverfel", error});
    } 
}

// Gillningar //
////////////////



// Hjälpfunktioner //
/////////////////////

const checkTextContent = (req, res) => {
    const {textContent} = req.body;

    if (!textContent) {
        res.status(codes.BAD_REQUEST).json({ message: "Inlägget måste innehålla text!" });
        return null;
    }
    return textContent;
}

