import {Db, MongoClient} from "mongodb";
import dotenv from 'dotenv';

dotenv.config();

const mongoUri: string = process.env.MONGO_URI!;
const client: MongoClient = new MongoClient(mongoUri);
const db: Db = client.db("blog-api");

async function runMongoDB() {
    try {
        await client.connect();
        console.log('MongoDB successfully connected')
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        await client.close();
    }
}

export {runMongoDB, db};