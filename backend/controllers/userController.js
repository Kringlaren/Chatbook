import db from '../db.js';
import codes from '../httpCodes.js';
import format from '../utils/format.js';
import fileHelper from '../utils/fileHelper.js';

const selectUserQuery = `
    SELECT users.id, username, profile_pic, banner_img, bio, text_color, bg_color, detail_color, users.created_at, COUNT(followers.id) AS followers_count,
        CASE 
            WHEN EXISTS (
                SELECT 1 
                FROM followers 
                WHERE followers.user2_id = users.id
                AND followers.user1_id = ?
        )   THEN true
        ELSE false
        END AS followed_by_user
    FROM users 
    LEFT JOIN followers ON users.id = followers.user2_id
`;

const selectFollowingByUserId = `
    SELECT users.id, users.username, users.profile_pic 
    FROM users 
    LEFT JOIN followers ON users.id = followers.user2_id 
    WHERE user1_id = ?
`;

// Hämtar användardata med namn
export const getUserByName = async (req, res) => {
    const username = req.params.username;
    const userId = req.session.userId;
    
    try {
        let [rows] = await db.query(selectUserQuery + `WHERE username = ?`, [userId, username]);
        if (rows.length === 0) return res.status(codes.NOT_FOUND).json({ message: "Användaren hittades inte"});

        rows = format.formatValuesForFrontEnd(rows);
        rows = format.formatColorsForFrontEnd(rows);

        res.status(codes.OK).json({ user: rows[0] });
    } catch (error) {
        res.status(codes.SERVER_ERROR).json({ message: "Serverfel vid hämtning av användare", error});
    } 
};

//Användarinställningar //
//////////////////////////

// Hämtar info om profilbild, banderoll och färgpreferenser
export const getUserPreferences = async (req, res) => {
    const userId = req.session.userId;
    if (!userId) return res.status(codes.UNAUTHORIZED).json({ message: "Ingen användare inloggad" });

    try {
        let [rows] = await db.query("SELECT profile_pic, banner_img, text_color, bg_color, detail_color, link_color FROM users WHERE id = ?", [userId]);
        if (rows.length === 0) return res.status(codes.NOT_FOUND).json({ message: "Användaren hittades inte"});

        rows = format.formatColorsForFrontEnd(rows);

        res.status(codes.OK).json({ preferences: rows[0] });
    } catch (error) {
        res.status(codes.SERVER_ERROR).json({ message: "Serverfel vid hämtning av användarpreferenser", error });
    }
};

export const changeBanner = async (req, res) => {
    changeImage(req, res, "banner");
};
export const changeProfilePic = async (req, res) => {
    changeImage(req, res, "profile");
};

export const changeBio = async (req, res) => {
    const userId = req.session.userId;
    if (!userId) return res.status(codes.UNAUTHORIZED).json({ message: "Inte inloggad" });

    const { content } = req.body;

    try {
        await db.query("UPDATE users SET bio = ? WHERE id = ?", [content, userId]);

        const [rows] = await db.query("SELECT bio FROM users WHERE id = ?", [userId]);
        res.status(codes.OK).json({ bio: rows[0].bio });
    } catch (error) {
        res.status(codes.SERVER_ERROR).json({ message: "Serverfel vid uppdatering av beskrivning" });
    }
};

// Uppdaterar de färger som skickas med i formatet [{ type: "type", color: rgb(r, g, b) }, ...], bygger på SQL query beroende på hur många och vilka färger som skickats med
export const changeColors = async (req, res) => {
    const { colors } = req.body;
    const updates = [];
    const values = [];

    const userId = req.session.userId;
    if (!userId) return res.status(codes.UNAUTHORIZED).json({ message: "Inte inloggad" });
  
    try {
        if (!Array.isArray(colors) || colors.length === 0) {
            return res.status(codes.BAD_REQUEST).json({ message: "Ogiltig färgdata" });
        }

        colors.forEach(({ type, color }) => {
            if (!type || !color) return res.status(codes.BAD_REQUEST).json({ message: "Ogiltig färgdata" });
            const hex = format.rgbToHex(color);
            updates.push(`${type} = ?`);
            values.push(hex);
        });

        values.push(userId);

        const join = updates.join(", ");
        
        const query = `UPDATE users SET ${join} WHERE id = ?`;

        await db.query(query, values);
      
        res.status(codes.OK).json({ colors: colors });
    } catch (error) {
        res.status(codes.SERVER_ERROR).json({ message: "Serverfel vid uppdatering av färg", error });
    }
}


// Följningar //
////////////////

// Börjar följa om man inte redan följer, avföljer annars
export const changeFollowByName = async (req, res) => {
    let { username } = req.body;
    username = format.formatNameForBackEnd(username);

    const userId = req.session.userId;
    if (!userId) return res.status(codes.UNAUTHORIZED).json({ message: "Inte inloggad" });

    let isFollowing;

    try {
        const [result] = await db.query("SELECT id FROM users WHERE username = ?", [username]);
        const followUserId = result[0].id;

        const [currentFollow] = await db.query("SELECT id FROM followers WHERE user1_id = ? AND user2_id = ?", [userId, followUserId]);
        if (currentFollow.length === 0) {
            await db.query("INSERT INTO followers (user1_id, user2_id) VALUES (?, ?)", [userId, followUserId]);
            isFollowing = true;
        } else {
            await db.query("DELETE FROM followers WHERE user1_id = ? AND user2_id = ?", [userId, followUserId]);
            isFollowing = false;
        }

        let [rows] = await db.query(selectUserQuery + "WHERE users.id = ?", [userId, followUserId]);
        rows = format.formatValuesForFrontEnd(rows);

        res.status(codes.OK).json({ 
            user: rows[0],
            following: isFollowing
         });
    } catch (error) {
        res.status(codes.SERVER_ERROR).json({ message: "Serverfel vid följning", error });
    }
};

// Hämtar id, namn och profilbild på alla någon följer
export const getFollowedUsersByName = async (req, res) => {
    let userId;

    try {
        const username = req.params.username;
        const [idResult] = await db.query("SELECT id FROM users WHERE username = ?", [username]);
        userId = idResult[0].id;

        let [rows] = await db.query(selectFollowingByUserId, [userId]);        
        rows = format.formatValuesForFrontEnd(rows);

        res.status(codes.OK).json({ users: rows });

    } catch (error) {
        res.status(codes.SERVER_ERROR).json({ message: "Serverfel vid hämntning av följare" });
    }
};


// Byter ut bilder och tar bort de gamla bilderna, typer: banner, profile
const changeImage = async (req, res, type) => {
    const userId = req.session.userId;
    if (!userId) return res.status(codes.UNAUTHORIZED).json({ message: "Inte inloggad" });

    let column;
    let defaultFile;
    let errorMessage;
    switch (type) {
        case "banner":
            column = "banner_img";
            defaultFile = "/uploads/banner.jpg";
            errorMessage = "Serverfel vid uppdatering av banderoll";
            break;
        case "profile":
            column = "profile_pic";
            defaultFile = "/uploads/pp.png";
            errorMessage = "Serverfel vid uppdatering av profilbild";
            break;
    }

    try {
        const [result] = await db.query(
            `SELECT ${column} FROM users WHERE id = ?`,
            [userId]
        );
    
        const oldImg = result[0][column];
        if (oldImg && oldImg !== defaultFile) {
            await fileHelper.deleteOldImage(oldImg);
        }

        const imgUrl = `/uploads/${req.file.filename}`;
        await db.query(`UPDATE users SET ${column} = ? WHERE id = ?`, [imgUrl, userId]);

        const [rows] = await db.query(`SELECT ${column} FROM users WHERE id = ?`, [userId]);
        
        res.status(codes.OK).json({ [column]: rows[0][column] });
    } catch (error) {
        res.status(codes.SERVER_ERROR).json({ message: errorMessage, error });
    }
};


