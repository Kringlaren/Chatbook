import express from "express";
import session from "express-session";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";
import path from "path";
import db from "./db.js";

// Sessioner sparas efter serveromstart
import MySQLStore from "express-mysql-session";
const MySQLSessionStore = MySQLStore(session);
const sessionStore = new MySQLSessionStore({}, db);

import dotenv from 'dotenv';
dotenv.config({ path: "../.env" });

const port = process.env.PORT;


const app = express();

app.use(cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true
}));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,              
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        httpOnly: true,         // Skydda mot XSS-attacker
        sameSite: 'lax'
    }
}));

// För att kunna tolka json-data så att req.body fungerar
app.use(express.json());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/game', gameRoutes);



app.listen(port, () => {
    console.log(`Server körs på port ${port}`);
});
