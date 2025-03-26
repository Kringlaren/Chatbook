import db from '../db.js';
import codes from '../httpCodes.js';

// Hämtar användardata med id
export const getUser = async (req, res) => {
    try {
        const id = req.params.id;
        const [rows] = await db.query("SELECT * FROM users WHERE id=?", [id]);
        
        res.status(codes.OK).json(rows[0]);
    } catch (error) {
        res.status(codes.SERVER_ERROR).json({ message: "Serverfel", error});
    }
    
};