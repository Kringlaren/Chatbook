import express from "express";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";

import dotenv from 'dotenv';
dotenv.config({ path: "../.env" });

const port = process.env.PORT;


const app = express();

// För att kunna tolka json-data så att req.body fungerar
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
