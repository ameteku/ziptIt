import express from 'express';
import DBConnector from './services/dbConnector.service';
import type { User } from "./models/user.model";
const server = express();

server.get('/', (req, res)=> {
    res.send("Hiiii success my boy");
});

server.get('/test', (req, res)=> {
    res.send("Hiiii another success my boy");
});

server.listen(8000, ()=> {
    console.log("Listening on 8000");
})