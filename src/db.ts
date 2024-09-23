import {MongoClient, ServerApiVersion} from "mongodb";

export async function runMongoDB() {
    const client: MongoClient = new MongoClient(process.env.MONGO_URI!, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
    try {
        await client.connect();
        console.log("MongoDB successfully connected");
    } catch (error) {
        await client.close();
        console.log(error)
    }
}

