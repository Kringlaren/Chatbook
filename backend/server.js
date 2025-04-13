import express from "express";
import session from "express-session";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import path from "path";

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
    saveUninitialized: true,
    cookie: {
        httpOnly: true,         // Skydda mot XSS-attacker
    }
}));

// För att kunna tolka json-data så att req.body fungerar
app.use(express.json());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/posts', postRoutes);



app.listen(port, () => {
    console.log(`Server körs på port ${port}`);
});
