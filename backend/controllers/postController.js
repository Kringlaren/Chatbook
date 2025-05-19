import db from '../db.js';
import codes from '../httpCodes.js';
import format from '../utils/format.js';


const selectAndJoinPostQuery = `
    SELECT posts.*, COUNT(DISTINCT likes.id) AS like_count, COUNT(DISTINCT comments.id) AS comment_count, users.username, users.profile_pic, 
        CASE 
            WHEN EXISTS (
            SELECT * 
            FROM likes 
            WHERE likes.post_id = posts.id 
            AND likes.user_id = ?
        )   THEN true
        ELSE false
        END AS liked_by_user
    FROM posts 
    LEFT JOIN likes ON posts.id = likes.post_id 
    LEFT JOIN comments ON posts.id = comments.post_id
    LEFT JOIN users ON posts.user_id = users.id
`;

const getPostByIdQuery = `
    ${selectAndJoinPostQuery}
    WHERE posts.id = ?
`;

const getAllPostsQuery = `
    ${selectAndJoinPostQuery}
    GROUP BY posts.id
    ORDER BY created_at DESC;
`;

const getPostsByUsernameQuery = `
    ${selectAndJoinPostQuery}
    WHERE users.username = ?
    GROUP BY posts.id
    ORDER BY created_at DESC;
`;

const selectAndJoinCommentQuery = `
    SELECT comments.*, users.username, users.profile_pic
    FROM comments
    LEFT JOIN users ON comments.user_id = users.id
`;

const getCommentsForPostQuery = `
    ${selectAndJoinCommentQuery}
    WHERE post_id=?
    GROUP BY comments.id
    ORDER BY created_at DESC
`;

const getCommentById = `
    ${selectAndJoinCommentQuery}
    WHERE comments.id = ?;
`;

// Inlägg //
////////////

// Hämtar alla inlägg från databasen med användarnamn och likes
export const getAllPosts = async (req, res) => {
    try {
        let [rows] = await db.query(getAllPostsQuery, [req.session.userId]);

        rows = format.formatValuesForFrontEnd(rows);

        res.status(codes.OK).json({posts: rows});
    } catch (error) {
        res.status(codes.SERVER_ERROR).json({ message: "Serverfel vid hämtning av inlägg", error });
    }
};

// Hämtar alla inlägg av en specifik användare
export const getPostsByUsername = async (req, res) => {
    const username = req.params.username;
    const userId = req.session.userId;

    try {
        let [rows] = await db.query(getPostsByUsernameQuery, [userId, username]);
        rows = format.formatValuesForFrontEnd(rows);

        res.status(codes.OK).json(rows);
    } catch (error) {
        res.status(codes.SERVER_ERROR).json({ message: "Serverfel vid hämtning av inlägg", error });
    }
}

// Skapar ett inlägg med eller utan bild
export const createPost = async (req, res) => {
    const userId = req.session.userId;
    if (!userId) return res.status(codes.UNAUTHORIZED).json({ message: "Inte inloggad" });

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

// Kommentarer //
/////////////////

// Skapar kommentar på ett inlägg med eller utan bild
export const createComment = async (req, res) => {
    const { postId } = req.body;
    const userId = req.session.userId;
    if (!userId) return res.status(codes.UNAUTHORIZED).json({ message: "Inte inloggad" });

    const textContent = checkTextContent(req, res);

    if (!textContent) return;

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        const [result] = await db.query("INSERT INTO comments (user_id, post_id, content, image) VALUES (?, ?, ?, ?)", [userId, postId, textContent, imageUrl]);
        const commentId = result.insertId;

        let [posts] = await db.query(getPostByIdQuery, [userId, postId]);
        posts = format.formatValuesForFrontEnd(posts[0]);

        let [comments] = await db.query(getCommentById, [commentId]);
        comments = format.formatValuesForFrontEnd(comments[0]);

        res.status(codes.CREATED).json({post: posts[0], comment: comments[0]});
    } catch (error) {
        res.status(codes.SERVER_ERROR).json({ message: "Serverfel vid skapande av kommentar", error });
    }
}

// Hämtar alla kommentarer för ett visst inlägg
export const getCommentsForPost = async (req, res) => {
    const postId = req.params.id;

    try {
        let [rows] = await db.query(getCommentsForPostQuery, [postId]);

        rows = format.formatValuesForFrontEnd(rows);
        
        res.status(codes.OK).json(rows);

    } catch (error) {
        res.status(codes.SERVER_ERROR).json({ message: "Serverfel vid hämtning av kommentarer", error });
    }
}

// Gillningar //
////////////////

// Lägger till en like om användare inte likeat, tar bort annars
export const likeChange = async (req, res) => {
    const { postId } = req.body;
    const userId = req.session.userId;
    if (!userId) return res.status(codes.UNAUTHORIZED).json({ message: "Inte inloggad" });
    
    let isLiked;

    try {
        const [result] = await db.query('SELECT 1 FROM likes WHERE user_id = ? AND post_id = ?', [userId, postId]);

        if (result.length === 0) {
            await db.query("INSERT INTO likes (user_id, post_id) VALUES (?, ?)", [userId, postId]);
            isLiked = true;
        } else {
            await db.query("DELETE FROM likes WHERE user_id = ? AND post_id = ?", [userId, postId]);
            isLiked = false;
        }

        let [rows] = await db.query(getPostByIdQuery, [userId, postId]);
        rows = format.formatValuesForFrontEnd(rows[0]);

        res.status(codes.CREATED).json({
            post: rows[0],
            liked: isLiked
        });
    } catch (error) {
        res.status(codes.SERVER_ERROR).json({ message: "Serverfel vid likehantering", error });
    }
};

// Hjälpfunktioner //
/////////////////////

const checkTextContent = (req, res) => {
    const { textContent } = req.body;

    if (!textContent) {
        res.status(codes.BAD_REQUEST).json({ message: "Måste innehålla text!" });
        return null;
    }
    return textContent;
}