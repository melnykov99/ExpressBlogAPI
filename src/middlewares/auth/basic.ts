import {Request, Response, NextFunction} from "express";
import {BASIC_AUTH, HTTP} from "../../common/constants";

function basicAuth(req: Request, res: Response, next: NextFunction) {
    if (req.headers.authorization !== BASIC_AUTH) {
        res.sendStatus(HTTP.UNAUTHORIZED);
        return
    }
    next();
}

export {basicAuth}