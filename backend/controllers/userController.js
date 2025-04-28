import db from '../db.js';
import codes from '../httpCodes.js';
import format from '../utils/format.js';
import fileHelper from '../utils/fileHelper.js';

// Hämtar användardata med namn
export const getUserByName = async (req, res) => {
    const username = req.params.username;
    
    try {
        let [rows] = await db.query("SELECT id, username, profile_pic, banner_img, bio, text_color, bg_color, detail_color, created_at FROM users WHERE username = ?", [username]);
        if (rows.length === 0) return res.status(codes.NOT_FOUND).json({ message: "Användaren hittades inte"});

        rows = format.formatValuesForFrontEnd(rows);

        res.status(codes.OK).json(rows[0]);
    } catch (error) {
        res.status(codes.SERVER_ERROR).json({ message: "Serverfel vid hämtning av användare", error});
    } 
};

//Användarinställningar

export const getUserPreferences = async (req, res) => {
    const userId = req.session.userId;

    if (!userId) return res.status(codes.UNAUTHORIZED).json({ message: "Ingen användare inloggad" });

    try {
        let [rows] = await db.query("SELECT profile_pic, text_color, bg_color, detail_color FROM users WHERE id = ?", [userId]);
        if (rows.length === 0) return res.status(codes.NOT_FOUND).json({ message: "Användaren hittades inte"});

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

// Följningar

export const followUserByName = async (req, res) => {
    const username = req.body.username;
    const userId = req.session.userId;
    try {
        const [result] = await db.query("SELECT id FROM users WHERE username = ?", [username]);
        const followUserId = result[0].id;

        await db.query("INSERT INTO followers (user1_id, user2_id) VALUES (?, ?)", [userId, followUserId]);

        const [rows] = await db.query("SELECT username, profile_pic, bio, text_color, bg_color, detail_color, created_at FROM users WHERE id = ?", [followUserId]);
        rows = format.formatValuesForFrontEnd(rows);

        res.status(codes.OK).json({ user: rows[0] });
    } catch (error) {
        res.status(codes.SERVER_ERROR).json({ message: "Serverfel vid följning", error });
    }
}


//Byter ut bilder och tar bort de gamla bilderna
const changeImage = async (req, res, type) => {
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
    }

    const userId = req.session.userId;
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


