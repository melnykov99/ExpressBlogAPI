import {NextFunction, Request, Response} from "express";
import {Result, ValidationError, validationResult} from "express-validator";
import {HTTP} from "../common/constants";
import {ErrorMessage, ErrorsMessagesOutput} from "../types/validation";

function validationHandler(req: Request, res: Response, next: NextFunction) {
    const errors: Result<ValidationError> = validationResult(req);
    if (errors.isEmpty()) {
        next();
        return;
    }

    const errorsMessagesOutput: ErrorsMessagesOutput = { errorsMessages: [] };

    errors.array().forEach((error: ValidationError) => {
        // error will always have a 'path', check for Typescript
        if ('path' in error) {
            const errorMessage: ErrorMessage = {
                message: error.msg,
                field: error.path,
            }
            errorsMessagesOutput.errorsMessages.push(errorMessage)
        } else {
            // if error still did not contain a 'path', then return  400 without body
            res.sendStatus(HTTP.BAD_REQUEST);
            return;
        }
    });
    res.status(HTTP.BAD_REQUEST).send(errorsMessagesOutput);
}
export {validationHandler};