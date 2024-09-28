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

// route for tests, deletes all data from db
app.use('/testing/all-data', testingRouter);

const startApp = async () => {
    runMongoDB().catch(console.dir);
    app.listen(PORT, () => {
        console.log(`app listening on port ${PORT}`);
    })
}
startApp().catch(console.dir);
