import db from '../db.js';
import codes from '../httpCodes.js';
import format from '../utils/format.js';

const selectAndJoinPartQuery = `
    SELECT scoreboard.*, users.username
    FROM scoreboard
    LEFT JOIN users ON scoreboard.user_id = users.id
`;

const getAllHighscoresQuery = `
    ${selectAndJoinPartQuery}
    ORDER BY scoreboard.score DESC
`;

const getHighscoreFromUserIdQuery = `
    ${selectAndJoinPartQuery}
    WHERE scoreboard.user_id = ?
`;

export const saveHighscore = async (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
        return res.status(codes.UNAUTHORIZED).json({ message: "Inte inloggad" });
    }

    const { score } = req.body;

    try {
        const [result] = await db.query("SELECT score FROM scoreboard WHERE user_id = ?", [userId]);

        if (result.length === 0) {
            await db.query("INSERT INTO scoreboard (user_id, score) VALUES (?, ?)", [userId, score]);
        } else {
            if (score < result[0].score) {
                return res.status(codes.BAD_REQUEST).json({ message: "Lägre poäng vid sparning av rekord" });
            }
            await db.query("UPDATE scoreboard SET score = ? WHERE user_id = ?", [score, userId]);
        }

        let [rows] = await db.query(getHighscoreFromUserIdQuery, [userId]);
        rows = format.formatValuesForFrontEnd(rows);
        
        res.status(codes.OK).json({ score: rows[0] });
    } catch (error) {
        res.status(codes.SERVER_ERROR).json({ message: "Serverfel vid sparning av rekord" });
    }
};

export const getAllHighscores = async (req, res) => {
    try {
        let [rows] = await db.query(getAllHighscoresQuery);
        rows = format.formatValuesForFrontEnd(rows);
        
        res.status(codes.OK).json({ scores: rows });
    } catch (error) {
        res.status(codes.SERVER_ERROR).json({ message: "Serverfel vid hämntning av topplista" })
    }
};

export const getPersonalBest = async (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
        return res.status(codes.UNAUTHORIZED).json({ message: "Inte inloggad" });
    }

    try {
        let [rows] = await db.query(getHighscoreFromUserIdQuery, [userId]);

        rows = format.formatValuesForFrontEnd(rows);

        res.status(codes.OK).json({ score: rows[0] });
    } catch (error) {
        res.status(codes.SERVER_ERROR).json({ message: "Serverfel vid hämtning av personbästa" });
    }
}