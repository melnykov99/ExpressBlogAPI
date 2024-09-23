import express from "express";
import dotenv from "dotenv";
import blogsRouter from "./routes/blogs";
import postsRouter from "./routes/posts";
import {runMongoDB} from "./db";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use('/blogs', blogsRouter);
app.use('/posts', postsRouter);

// route for tests, deletes all data from db
app.delete('/testing/all-data', (req, res) => {

})

app.listen(PORT, () => {
    runMongoDB().catch(console.dir);
    console.log(`app listening on port ${PORT}`);
})