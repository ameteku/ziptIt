import { Response } from "express";

export default function sendErrorMessage(res: Response, errorCode: number, message?: string | number | boolean) {

    if( message) {
        res.status(errorCode).send(message);
    } else {
        res.sendStatus(errorCode);
    }


}