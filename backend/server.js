import express from "express";
import userRoutes from "./routes/userRoutes.js";

import dotenv from 'dotenv';
dotenv.config({ path: "../.env" });

const port = process.env.PORT;


const app = express();

// För att kunna tolka json-data så att req.body fungerar
app.use(express.json());
app.use('/api/user', userRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
