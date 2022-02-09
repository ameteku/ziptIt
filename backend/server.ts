import express from 'express';

const server = express();


server.get('test', (req, res)=> {
    res.send("Hiiii success my boy");
});


server.listen(8000, ()=> {
    console.log("Listening on 8000");
})
