import {blogsCollection, postsCollection} from "../db/collectionsMongoDB";
import {REPOSITORY} from "../types/constants";

async function deleteAllDataFromMongoDB(): Promise<string> {
    try {
        await blogsCollection.deleteMany({});
        await postsCollection.deleteMany({});
        return REPOSITORY.SUCCESSFULLY;
    } catch (error) {
        return REPOSITORY.ERROR;
    }
}

export default deleteAllDataFromMongoDB;