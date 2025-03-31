import db from '../db.js';
import codes from '../httpCodes.js';

// Hämtar användardata med namn
export const getUserByName = async (req, res) => {
    const username = req.params.username;
    
    try {
        const [rows] = await db.query("SELECT * FROM users WHERE username=?", [username]);
        if (rows.length === 0) return res.status(codes.NOT_FOUND).json({ message: "Användaren hittades inte"})

        res.status(codes.OK).json(rows[0]);
    } catch (error) {
        res.status(codes.SERVER_ERROR).json({ message: "Serverfel", error});
    } 
};