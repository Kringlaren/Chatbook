import db from '../db.js';
import codes from '../httpCodes.js';

///////////// Inlägg  /////////////
///////////////////////////////////

// GET //
/////////

// Hämtar alla inlägg från databasen med användarnamn och likes
export const getAllPosts = async (req, res) => {
    try {
        let [rows] = await db.query(`
        SELECT posts.*, COUNT(likes.id) AS like_count, users.username, users.profile_pic FROM posts 
        LEFT JOIN likes ON posts.id = likes.post_id 
        LEFT JOIN users ON posts.user_id = users.id
        GROUP BY posts.id
        ORDER BY created_at DESC
        `);

        rows = formatUserValues(rows);

        res.status(codes.OK).json(rows);
    } catch (error) {
        console.log(error);
        res.status(codes.SERVER_ERROR).json({ message: "Serverfel", error });
    }
};

// Hämtar ett inlägg med id
export const getPostById = async (req, res) => {
    const id = req.params.id;
    try {
        const row = await db.query(`
        SELECT posts.*, COUNT(likes.id) AS like_count FROM posts 
        LEFT JOIN likes ON posts.id = likes.post_id AND posts.id = ?
        `, [id]);

        row = formatUserValues(row);

        res.status(codes.OK).json(row);
    } catch (error) {
        res.status(codes.SERVER_ERROR).json({ message: "Serverfel", error });
    }
};

// Hämtar alla inlägg av en specifik användare
export const getPostsByUsername = async (req, res) => {
    const username = req.body.id;

    try {
        const [rows] = await db.query(`
        SELECT posts.*, COUNT(likes.id) AS like_count FROM posts 
        LEFT JOIN users ON posts.user_id = users.id AND users.username = ? 
        LEFT JOIN likes ON posts.id = likes.post_id
        GROUP BY posts.id;
        `, [username]);

        rows = formatUserValues(rows);

        res.status(codes.OK).json(rows);
    } catch (error) {
        res.status(codes.SERVER_ERROR).json({ message: "Serverfel", error });
    }
}

// POST //
//////////

// Skapar ett inlägg med eller utan bild
export const createPost = async (req, res) => {
    const userId = req.body.userId;
    const textContent = checkTextContent(req, res);

    if (!textContent) return;

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        await db.query("INSERT INTO posts (user_id, content, image) VALUES (?, ?, ?)", [userId, textContent, imageUrl]);
        res.status(codes.CREATED).json({ message: "Inlägg skapad!" });
    } catch (error) {
        res.status(codes.SERVER_ERROR).json({ message: "Serverfel", error });
    }
};

///////////// Kommentarer  /////////////
////////////////////////////////////////

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
        res.status(codes.SERVER_ERROR).json({ message: "Serverfel", error });
    }
}

// Hämtar alla kommentarer för ett visst inlägg
export const getCommentsForPost = async (req, res) => {
    const postId = req.params.id;

    try {
        const [rows] = await db.query("SELECT * FROM comments WHERE post_id=?", [postId]);
        res.status(codes.OK).json(rows);

    } catch (error) {
        res.status(codes.SERVER_ERROR).json({ message: "Serverfel", error });
    }
}

////////////// Gillningar //////////////
////////////////////////////////////////

export const like = async (req, res) => {
    const { userId, postId } = req.body;
    try {
        await db.query("INSERT INTO likes (user_id, post_id) VALUES (?, ?)", [userId, postId]);
        res.status(codes.CREATED).json({ message: "Like sparad!" });
    } catch (error) {
        res.status(codes.SERVER_ERROR).json({ message: "Serverfel", error });
    }
}



/////////// Hjälpfunktioner  ///////////
////////////////////////////////////////

const checkTextContent = (req, res) => {
    const textContent = req.body.textContent;

    if (!textContent) {
        res.status(codes.BAD_REQUEST).json({ message: "Inlägget måste innehålla text!" });
        return null;
    }
    return textContent;
}

const formatUserValues = (rows) => {
    const posts = Array.isArray(rows) ? rows : [rows];
    posts.forEach(row => {
        row.username = formatName(row.username);
        row.created_at = formatTime(row.created_at);
    });
    return posts;
}

const formatName = (name) => {
    return name.replace(/\./g, " ");
}

const formatTime = (time) => {
    return new Date(String(time)).toLocaleString("sv-SE", {
        dateStyle: "short",   // Kort datumformat
        timeStyle: "short"    // Kort tidsformat
    });
}

