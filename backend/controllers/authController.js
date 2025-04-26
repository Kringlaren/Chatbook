import bcrypt from 'bcryptjs';
import db from '../db.js';
import codes from '../httpCodes.js';
import format from '../utils/format.js';

// Antal omgångar av Bcrypts kryptering
const bcryptComputations = 10;

// Registrerar en användare och krypterar lösenordet
export const regUser = async (req, res) => {
    const userInput = checkUserInput(req, res);
    if (!userInput) return;

    const hashedPw = await hashPassword(userInput.password);
    const username = format.formatNameForBackEnd(userInput.username);

    try {
        const [result] = await db.query("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPw]);
        const newId = result.insertId;

        req.session.userId = newId;

        const [rows] = await db.query("SELECT profile_pic FROM users WHERE id = ?", [newId]);
        
        res.status(codes.CREATED).json({
            id: newId,
            username: userInput.username,
            profile_pic: rows[0].profile_pic
        });
    } catch (error) {
        res.status(codes.SERVER_ERROR).json({ message: "Användare finns redan", error });
    }
};

// Loggar in användare
export const logInUser = async (req, res) => {
    const userInput = checkUserInput(req, res);
    if (!userInput) return;

    const username = format.formatNameForBackEnd(userInput.username);

    const [rows] = await db.query('SELECT id, username, password, profile_pic FROM users WHERE username = ?', [username]);
    if (rows.length === 0) {
        return res.status(codes.UNAUTHORIZED).json({ message: "Fel användarnamn eller lösenord" });
    }

    try {
        const userPassword = rows[0].password
        const correctPassword = await bcrypt.compare(userInput.password, userPassword);
        if (!correctPassword) {
            return res.status(codes.UNAUTHORIZED).json({ message: "Fel användarnamn eller lösenord" });
        }
        req.session.userId = rows[0].id;

        res.status(codes.OK).json({
            id: rows[0].id,
            username: format.formatNameForFrontEnd(rows[0].username),
            profile_pic: rows[0].profile_pic
        });
    } catch (error) {
        res.status(codes.SERVER_ERROR).json({ message: "Serverfel vid inloggning", error });
    }
};

// Loggar ut användare genom att ta bort session i backend och kaka i frontend, session.detstroy stödjer inte await
export const logOutUser = async (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            return res.status(codes.SERVER_ERROR).json({ message: "Serverfel vid utloggning", error });
        }
        res.clearCookie("connect.sid");
        res.status(codes.OK).json({ message: "Utloggning lyckades!" });
        
    });
};

// Hämtar användarinfo för en inloggad användare
export const getLoggedInUser = async (req, res) => {
    if (!req.session.userId) {
        return res.status(codes.UNAUTHORIZED).json({ message: "Inte inloggad" });
    }

    try {
        const [rows] = await db.query('SELECT id, username, profile_pic FROM users WHERE id = ?', [req.session.userId]);
        return res.status(codes.OK).json({
            id: rows[0].id,
            username: format.formatNameForFrontEnd(rows[0].username),
            profile_pic: rows[0].profile_pic
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