import express from 'express';
import DBConnector from './services/dbConnector.service';
import UserRoutes from './routes/users.routes';
import checkKeys from './constants/keysChecker';
const server = express();

server.use(express.urlencoded());
server.use(express.json());
// loading connector
const dbConnector = new DBConnector();


const userRoutes = new UserRoutes(dbConnector);

server.get('/', (req, res)=> {
    res.send("Hiiii success my boy");
});

server.post('/login', (req, res)=> {
    console.log( typeof req.body);

    if(checkKeys(["username", "password"], Object.keys(req.body))) {

        userRoutes.loginUser(req.body).then(result => {
            res.send(result);
        }).
        catch(error => {
            console.log("Error logging in:", error);
           if(error === "EmptyFieldError") {
               res.sendStatus(400);
           }
           else {
               res.sendStatus(500);
           }
        });
    }

});

server.get('/test', (req, res)=> {
    res.send("Hiiii another success my boy");
});

server.listen(8000, ()=> {
    console.log("Listening on 8000");
})