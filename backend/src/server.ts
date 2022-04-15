import express from 'express';
import DBConnector from './services/dbConnector.service';
import UserRoutes from './routes/users.routes';
import checkKeys from './constants/keysChecker';
import DataRoutes from './routes/data.routes';
import bodyParser from 'body-parser';
import sendErrorMessage from './constants/sendErrorMessage';
import { getCookie } from './constants/cookieGetter';
const cors = require('cors');
const server = express();

server.use(express.urlencoded());
server.use(express.json());
server.use(cors({
    origin: '*'
}));

// loading connector
const dbConnector = new DBConnector();
const userRoutes = new UserRoutes(dbConnector);
const dataRoutes = new DataRoutes(dbConnector);

server.get('/', (req, res) => {
    res.send("Hiiii success my boy");
});

server.post('/login', (req, res) => {
    console.log(typeof req.body);

    if (checkKeys(["username", "password"], Object.keys(req.body))) {

        userRoutes.loginUser(req.body).then(result => {

            res.cookie("userAuth" ,result.cookie.zipAuthHash,{expires: result.cookie.expires, httpOnly: true}).send(result.userDetails);
        }).
            catch(error => {
                console.log("Error logging in:", error);
                if (error === "EmptyFieldError") {
                    res.sendStatus(400);
                }
                else {
                    res.sendStatus(500);
                }
            });
    }
    else {
            res.status(400).send("missing credentials");
    }

});

server.post('/register', (req, res) => {
    console.log(typeof req.body);

    if (checkKeys(["username", "password", "email"], Object.keys(req.body))) {

        userRoutes.registerUser(req.body).then(result => {
            res.cookie("userAuth" ,result.cookie.zipAuthHash,{expires: result.cookie.expires, httpOnly: true}).send(result.userDetails);
        }).
        catch(error => {
            console.log("Error registering in:", error);
            if (error === "EmptyFieldError") {
                sendErrorMessage(res, 400);
            }
            else {
                sendErrorMessage(res, 400);
            }
        });
    }
});


server.post('/add/:objectType', async (req, res) => {
    const objectType = req.params.objectType;
    const body = req.body;
    const cookie = getCookie(req)[1];

    if(!userRoutes.isLoggedInUser(cookie)) {
        sendErrorMessage(res, 404, "not logged in");
        return;
    }

    if (!body) {
        sendErrorMessage(res, 404, "body is empty");
        return;
    }

    let isSuccess = false;
    switch (objectType) {
        case 'class':
            if (!checkKeys(['title', 'description'], Object.keys(body))) {
                break;
            }

            isSuccess = await dataRoutes.addClass(body.title, body.description);
            break;

        case 'topic':
            if (!checkKeys(['title', 'description', 'classId'], Object.keys(body))) {
                break;
            }

            isSuccess = await dataRoutes.addTopic(body.title, body.description, body.classId);
            break;

        case 'link':
            console.log("in link", body);
            if(!checkKeys(['title', 'description', 'classId', 'topicId', 'link'], Object.keys(body))) {
                break;
            }

            isSuccess = await dataRoutes.addLink(body.title, body.description, body.classId, body.topicId, body.link);
            break;
        default:
            sendErrorMessage(res, 400, "Missing endpoint parameter, use topic or class");
            return;
    }

    if (isSuccess) {
        res.send('Success')
    }
    else {
        sendErrorMessage(res, 500, `Failed to add ${objectType}, check your parameters.`);
    }
});

// send a rating value out of 5, linkid, user account
server.post('/add-rating', async (req, res)=> {
    const body = req.body;
    const cookie = getCookie(req)[1];
    console.log(cookie);
    // checking for any wmissing items
    if(!cookie || !userRoutes.isLoggedInUser(cookie) || !body || !checkKeys(["rating", "linkId", "username"], Object.keys(body))) {
        sendErrorMessage(res, 401, "Bad request");
        return;
    }

    const isSuccess = await dataRoutes.addRating(body.rating, body.linkId);
    isSuccess ? res.send("success") : sendErrorMessage(res, 401, "Failed to add rating");

});

server.get('/:objectType/all/:parentId?', async (req, res) => {
    const objectType = req.params.objectType;

    if (!objectType) {
        sendErrorMessage(res, 404, "missing endpoint params, add topic or class");
        return;
    }

    switch (objectType) {
        case "class":
            dataRoutes.getAllClasses().then(result => {
                res.send(result);
            }).catch(error => {
                sendErrorMessage(res, 500, "An error occured getting classes: " + error);
            });
            return;

        case "topic":
            const classId = req.params.parentId
            if (!classId) {
                dataRoutes.getTopics().then(result => {
                    res.send(result);
                }).catch(error => {
                    sendErrorMessage(res, 500, "An error occured getting all topics: " + error);
                });
            } else {
                dataRoutes.getTopics(classId).then(result => {
                    res.send(result);
                }).catch(error => {
                    sendErrorMessage(res, 500, "An error occured getting class topics: " + error);
                });
            }
            return;
        case "link":
            const topicId = req.params.parentId;
            if (!topicId) {
                sendErrorMessage(res, 401, "can't perform this action, add topicId to endpoint");
                return;
            }
            dataRoutes.getTopicLinks(topicId).then(result => {
                res.send(result)
            }).catch(error => {
                sendErrorMessage(res, 500, "An error occured getting topic links has occurred: " + error);
            })
    }
});

// todo

// links

// add rating

server.get('/test', (req, res) => {
    res.send("Hiiii another success my boy");
});

server.listen(process.env.PORT || 8000, () => {
    console.log("Listening on 8000");
})