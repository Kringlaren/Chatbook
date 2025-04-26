import db from '../db.js';
import codes from '../httpCodes.js';
import format from '../utils/format.js';

// Hämtar användardata med namn
export const getUserByName = async (req, res) => {
    const username = req.params.username;
    
    try {
        let [rows] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
        if (rows.length === 0) return res.status(codes.NOT_FOUND).json({ message: "Användaren hittades inte"});

        rows = format.formatValuesForFrontEnd(rows);

        res.status(codes.OK).json(rows[0]);
    } catch (error) {
        res.status(codes.SERVER_ERROR).json({ message: "Serverfel vid hämtning av användare", error});
    } 
};

export const changeBanner = async (req, res) => {
    const userId = req.session.userId;
    try {
        const imgUrl = `/uploads/${req.file.filename}`;
        await db.query("UPDATE users SET banner_img = ? WHERE id = ?", [imgUrl, userId]);

        const [rows] = await db.query("SELECT banner_img FROM users WHERE id = ?", [userId]);
        
        res.status(codes.OK).json({ banner_img: rows[0].banner_img });
    } catch (error) {
        res.status(codes.SERVER_ERROR).json({ message: "Serverfel vid uppdatering av banderoll", error });
    }
};

export const changeProfilePic = async (req, res) => {
    const userId = req.session.userId;
    try {
        const imgUrl = `/uploads/${req.file.filename}`;
        await db.query("UPDATE users SET profile_pic = ? WHERE id = ?", [imgUrl, userId]);

        const [rows] = await db.query("SELECT profile_pic FROM users WHERE id = ?", [userId]);
        
        res.status(codes.OK).json({ profile_pic: rows[0].profile_pic });
    } catch (error) {
        res.status(codes.SERVER_ERROR).json({ message: "Serverfel vid uppdatering av profilbild", error });
    }
};