import express from "express";
import cors from 'cors';
import router from "./router";

const app = express();

app.use(cors({ 
    origin: ['http://localhost:5173'  , 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
}));
app.use(express.json());
app.use("/api", router);

const PORT = process.env.APP_PORT || 3310;

app.listen(PORT, () => {
    console.log(`le backend tourne sur le port ${PORT}`)
})