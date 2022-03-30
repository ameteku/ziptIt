import express from 'express';
import DBConnector from './services/dbConnector.service';
import UserRoutes from './routes/users.routes';
import checkKeys from './constants/keysChecker';
import DataRoutes from './routes/data.routes';
import bodyParser from 'body-parser';
import sendErrorMessage from './constants/sendErrorMessage';
const server = express();

server.use(express.urlencoded());
server.use(express.json());
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
            res.send(result);
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

});

server.post('/register', (req, res) => {
    console.log(typeof req.body);

    if (checkKeys(["username", "password", "email"], Object.keys(req.body))) {

        userRoutes.registerUser(req.body).then(result => {
            res.send(result);
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

    if (!body) {
        sendErrorMessage(res, 404, "body is empty");
        return;
    }

    let isSuccess: boolean;
    switch (objectType) {
        case 'class':
            if (!checkKeys(['title', 'description'], Object.keys(body))) {
                sendErrorMessage(res, 400, 'missing data');
                return;
            }

            isSuccess = await dataRoutes.addClass(body.title, body.description);
            break;
        case 'topic':
            if (!checkKeys(['title', 'description', 'classId'], Object.keys(body))) {
                sendErrorMessage(res, 400, 'missing data');
                return;
            }

            isSuccess = await dataRoutes.addTopic(body.title, body.description, body.classId);
            break;
        default:
            sendErrorMessage(res, 400, "Missing endpoint parameter, use topic or class");
    }

    if (isSuccess) {
        res.send('Success')
    }
    else {
        sendErrorMessage(res, 400, 'Failed to add class');
    }
});

server.get('/:objectType/all/:classid?', async (req, res) => {
    const objectType = req.params.objectType;

    if(!objectType) {
        sendErrorMessage(res, 404, "missing endpoint params, add topic or class");
        return;
    }

    switch(objectType) {
        case "class":
        dataRoutes.getAllClasses().then(result => {
            res.send(result);
        }).catch(error => {
            sendErrorMessage(res, 400, "An error occured: " + error);
        });
        return;

        case "topic":
            const classId = req.params.classid;
            if(!classId) {
                dataRoutes.getTopics().then(result => {
                    res.send(result);
                }).catch(error => {
                    sendErrorMessage(res, 400, "An error occured: " + error);
                });
            } else {
                dataRoutes.getTopics(classId).then(result => {
                    res.send(result);
                }).catch(error => {
                    sendErrorMessage(res, 400, "An error occured: " + error);
                });
            }
    }

});



// todo
// topics
// links
// add link
// add topic
// add class
// add rating



server.get('/test', (req, res) => {
    res.send("Hiiii another success my boy");
});

server.listen(8000, () => {
    console.log("Listening on 8000");
})