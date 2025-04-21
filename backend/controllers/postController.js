import db from '../db.js';
import codes from '../httpCodes.js';
import format from '../utils/format.js';

///////////// Inlägg  /////////////
///////////////////////////////////

const getPostByIdQuery = `
    SELECT posts.*, COUNT(DISTINCT likes.id) AS like_count, COUNT(DISTINCT comments.id) AS comment_count, users.username, users.profile_pic,
        CASE 
            WHEN EXISTS (
            SELECT * 
            FROM likes 
            WHERE likes.post_id = posts.id 
            AND likes.user_id = ?
        )   THEN true
        ELSE false
        END AS likedByUser
    FROM posts
    LEFT JOIN likes ON posts.id = likes.post_id
    LEFT JOIN comments ON posts.id = comments.post_id
    LEFT JOIN users ON posts.user_id = users.id
    WHERE posts.id = ?
    GROUP BY posts.id
`;

// GET //
/////////

// Hämtar alla inlägg från databasen med användarnamn och likes
export const getAllPosts = async (req, res) => {
    try {
        let [rows] = await db.query(`
        SELECT posts.*, COUNT(DISTINCT likes.id) AS like_count, COUNT(DISTINCT comments.id) AS comment_count, users.username, users.profile_pic, 
            CASE 
                WHEN EXISTS (
                SELECT * 
                FROM likes 
                WHERE likes.post_id = posts.id 
                AND likes.user_id = ?
            )   THEN true
            ELSE false
            END AS likedByUser
        FROM posts 
        LEFT JOIN likes ON posts.id = likes.post_id 
        LEFT JOIN comments ON posts.id = comments.post_id
        LEFT JOIN users ON posts.user_id = users.id
        GROUP BY posts.id
        ORDER BY created_at DESC
        `, [req.session.userId]);

        rows = format.formatValuesForFrontEnd(rows);

        res.status(codes.OK).json({posts: rows});
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

        rows = format.formatValuesForFrontEnd(rows);

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
        const [result] = await db.query("INSERT INTO posts (user_id, content, image) VALUES (?, ?, ?)", [userId, textContent, imageUrl]);
        const postId = result.insertId;

        let [rows] = await db.query(getPostByIdQuery, [userId, postId]);
        rows = format.formatValuesForFrontEnd(rows);

        res.status(codes.CREATED).json({posts: rows[0]});
    } catch (error) {
        res.status(codes.SERVER_ERROR).json({ message: "Serverfel vid skapande av inlägg", error });
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

        let [rows] = await db.query(getPostByIdQuery, [userId, postId]);
        rows[0] = format.formatValuesForFrontEnd(rows[0]);

        res.status(codes.CREATED).json({posts: rows[0]});
    } catch (error) {
        res.status(codes.SERVER_ERROR).json({ message: "Serverfel vid skapande av kommentar", error });
    }
}

// Hämtar alla kommentarer för ett visst inlägg
export const getCommentsForPost = async (req, res) => {
    const postId = req.params.id;

    try {
        let [rows] = await db.query(`
            SELECT comments.*, users.username, users.profile_pic
            FROM comments
            LEFT JOIN users ON comments.user_id = users.id
            WHERE post_id=?
            GROUP BY comments.id
            ORDER BY created_at DESC
        `, [postId]);

        rows = format.formatValuesForFrontEnd(rows);
        
        res.status(codes.OK).json(rows);

    } catch (error) {
        res.status(codes.SERVER_ERROR).json({ message: "Serverfel vid hämtning av kommentarer", error });
    }
}

////////////// Gillningar //////////////
////////////////////////////////////////

// Lägger till en like om användare inte likeat, tar bort annars
export const likeChange = async (req, res) => {
    const { userId, postId } = req.body;
    let isLiked;

    try {
        const [result] = await db.query('SELECT * FROM likes WHERE user_id = ? AND post_id = ?', [userId, postId]);

        if (result.length === 0) {
            await db.query("INSERT INTO likes (user_id, post_id) VALUES (?, ?)", [userId, postId]);
            isLiked = true;
        } else {
            await db.query("DELETE FROM likes WHERE user_id = ? AND post_id = ?", [userId, postId]);
            isLiked = false;
        }

        let [rows] = await db.query(getPostByIdQuery, [userId, postId]);
        rows[0] = format.formatValuesForFrontEnd(rows[0]);

        res.status(codes.CREATED).json({
            posts: rows[0],
            liked: isLiked
        });
    } catch (error) {
        res.status(codes.SERVER_ERROR).json({ message: "Serverfel vid likehantering", error });
    }
};

/////////// Hjälpfunktioner  ///////////
////////////////////////////////////////

const checkTextContent = (req, res) => {
    const textContent = req.body.textContent;

    if (!textContent) {
        res.status(codes.BAD_REQUEST).json({ message: "Måste innehålla text!" });
        return null;
    }
    return textContent;
}