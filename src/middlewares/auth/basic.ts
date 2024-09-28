import {Request, Response, NextFunction} from "express";
import {HTTP} from "../../common/constants";

function basicAuth(req: Request, res: Response, next: NextFunction) {
    if (req.headers.authorization !== 'Basic YWRtaW46cXdlcnR5') {
        res.sendStatus(HTTP.UNAUTHORIZED);
        return
    }
    next();
}

export {basicAuth}