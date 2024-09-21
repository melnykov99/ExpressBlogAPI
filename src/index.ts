import express, { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();

const PORT = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
    res.status(200).send("hello");
});

app.listen(PORT, () => {
    console.log(`app listening on port ${PORT}`)
})