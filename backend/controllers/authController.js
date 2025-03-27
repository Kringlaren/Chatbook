import bcrypt from 'bcryptjs';
import db from '../db.js';
import codes from '../httpCodes.js';

// Antal omgångar av Bcrypts kryptering
const bcryptComputations = 10;

// Registrerar en användare och krypterar lösenordet
export const regUser = async (req, res) => {
    const userInput = checkUserInput(req, res);
    if (!userInput) return;

    const hashedPw = await hashPassword(userInput.password);

    try {
        await db.query("INSERT INTO users (username, password) VALUES (?, ?)", [userInput.username, hashedPw]);
        res.status(codes.CREATED).json({ message: "Användare registrerad!" });
    } catch (error) {
        res.status(codes.SERVER_ERROR).json({ message: "Serverfel", error });
    }
};

// Loggar in användare
export const logInUser = async (req, res) => {
    const userInput = checkUserInput(req, res);
    if (!userInput) return;

    const [rows] = await db.query('SELECT password FROM users WHERE username = ?', [userInput.username]);
    if (rows.length === 0) {
        return res.status(codes.UNAUTHORIZED).json({ message: "Fel användarnamn eller lösenord" });
    }

    try {
        const userPassword = rows[0].password
        const correctPassword = await bcrypt.compare(userInput.password, userPassword);
        if (!correctPassword) {
            return res.status(codes.UNAUTHORIZED).json({ message: "Fel användarnamn eller lösenord" });
        }
        res.status(codes.OK).json({ message: "Inloggning lyckades!" });
    } catch (error) {
        res.status(codes.SERVER_ERROR).json({ message: "Serverfel", error });
    }
   
};


// Hjälpfunktioner //
/////////////////////

// Kontrollerar att användaren skrivit in både användarnamn och lösenord
const checkUserInput = (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(codes.BAD_REQUEST).json({ message: "Alla fält måste fyllas i" });
        return null;
    }
    return { username, password };
};

// Krypterar lösenord med bcryptjs
const hashPassword = async (password) => {
    return await bcrypt.hash(password, bcryptComputations)
};