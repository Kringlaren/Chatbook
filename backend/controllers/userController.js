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