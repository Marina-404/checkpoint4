import express from "express";
import cors from 'cors';
import router from "./router";

const app = express();

app.use(cors({ 
    origin: process.env.CLIENT_URL || 'http://localhost:5173' 
}));
app.use(express.json());
app.use(router);

const PORT = process.env.APP_PORT || 3310;

app.listen(PORT, () => {
    console.log(`le backend tourne sur le port ${PORT}`)
})