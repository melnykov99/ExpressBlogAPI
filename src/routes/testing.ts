import {Router, Request, Response} from "express";
import deleteAllDataFromMongoDB from "../repositories/testing";
import {HTTP, REPOSITORY} from "../common/constants";

// route for tests, deletes all data from db
const testingRouter = Router();

testingRouter.delete('/', async (req: Request, res: Response) => {
    // This router goes directly to the repository
    const result: string = await deleteAllDataFromMongoDB();
    if (result === REPOSITORY.ERROR) {
        res.sendStatus(HTTP.SERVER_ERROR);
        return;
    }
    res.sendStatus(HTTP.NO_CONTENT);
})

export default testingRouter;