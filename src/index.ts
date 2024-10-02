import express from "express";
import dotenv from "dotenv";
import blogsRouter from "./routes/blogs";
import postsRouter from "./routes/posts";
import testingRouter from "./routes/testing";
import {runMongoDB} from "./db/configMongoDB";
import bodyParser from "body-parser";

dotenv.config();

const app = express();
const PORT: string = process.env.PORT!;

app.use(bodyParser.json());

app.use('/blogs', blogsRouter);
app.use('/posts', postsRouter);
app.use('/testing/all-data', testingRouter);

const startApp = async () => {
    try {
        await runMongoDB();
         app.listen(PORT, () => {
            console.log(`App listening on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start app:', error);
    }
}
startApp().catch(console.error);

export {app};