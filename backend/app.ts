import express from "express";
import cors from 'cors';
import router from "./router";

const app = express();
app.use(router);
app.use(express.json());

app.use(cors({ 
    origin: 'http://localhost:5173' 
}));


app.listen(300, () => {
    console.log("le backend tourne sur le port 3000")
})