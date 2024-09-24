import express from "express";
import dotenv from "dotenv";
import blogsRouter from "./routes/blogs";
import postsRouter from "./routes/posts";
import {runMongoDB} from "./db/configMongoDB";
import bodyParser from "body-parser";

dotenv.config();
const jsonBodyMiddleware = bodyParser.json();

const app = express();
const PORT = process.env.PORT;

app.use(jsonBodyMiddleware);

app.use('/blogs', blogsRouter);
app.use('/posts', postsRouter);

// route for tests, deletes all data from db
app.delete('/testing/all-data', (req, res) => {

})

const startApp = async () => {
    runMongoDB().catch(console.dir);
    app.listen(PORT, () => {
        console.log(`app listening on port ${PORT}`);
    })
}
startApp().catch(console.dir);
