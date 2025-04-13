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
    const username = removeSpace(userInput.username);

    try {
        await db.query("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPw]);
        res.status(codes.CREATED).json({ message: "Användare registrerad!" });
    } catch (error) {
        res.status(codes.SERVER_ERROR).json({ message: "Användare finns redan", error });
    }
};

// Loggar in användare
export const logInUser = async (req, res) => {
    const userInput = checkUserInput(req, res);
    if (!userInput) return;

    const username = removeSpace(userInput.username);

    const [rows] = await db.query('SELECT username, password, profile_pic FROM users WHERE username = ?', [username]);
    if (rows.length === 0) {
        return res.status(codes.UNAUTHORIZED).json({ message: "Fel användarnamn eller lösenord" });
    }

    try {
        const userPassword = rows[0].password
        const correctPassword = await bcrypt.compare(userInput.password, userPassword);
        if (!correctPassword) {
            return res.status(codes.UNAUTHORIZED).json({ message: "Fel användarnamn eller lösenord" });
        }
        
        req.session.userId = rows[0].user_id;

        res.status(codes.OK).json({
            username: rows[0].username,
            profilePic: rows[0].profile_pic
        });
    } catch (error) {
        res.status(codes.SERVER_ERROR).json({ message: "Serverfel", error });
    }
   
};

// Hämtar användarinfo för en inloggad användare
export const getLoggedInUser = async (req, res) => {
    if (!req.session.userId) {
        return res.status(codes.UNAUTHORIZED).json({ message: "Inte inloggad" });
    }

    try {
        const [rows] = await db.query('SELECT username, profile_pic FROM users WHERE user_id = ?', [req.session.userId]);

        return res.status(codes.OK).json({
            loggedIn: true,
            username: rows[0].username,
            profilePic: rows[0].profile_pic
        });
    } catch (error) {
        return res.status(codes.SERVER_ERROR).json({ message: "Serverfel", error });
    }

    
};


//////////// Hjälpfunktioner ////////////
////////////////////////////////////////

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

// Ersätter alla blanksteg med punkter
const removeSpace = (name) => {
    return name.replace(/\s+/g, ".");
}