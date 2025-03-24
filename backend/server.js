import express from "express";

import dotenv from 'dotenv';
dotenv.config({ path: "../.env" });

const port = process.env.PORT;


const app = express();

// För att kunna tolka json-data så att req.body fungerar
app.use(express.json());

