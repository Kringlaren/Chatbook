import bcrypt from 'bcrypt';
import db from '../db.js';

const codes = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    SERVER_ERROR: 500
}

// Antal omgångar av Bcrypts kryptering
const bcryptComputations = 10;

// Registrerar en användare och krypterar lösenordet
export const regUser = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(codes.BAD_REQUEST).json({ message: "Alla fält måste fyllas i" });
    }

    const hashedPw = await bcrypt.hash(password, bcryptComputations);

    try {
        await db.query("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPw]);
        res.status(codes.CREATED).json({ message: "Användare registrerad!" });
    } catch (error) {
        res.status(codes.SERVER_ERROR).json({ message: "Serverfel", error });
    }
};