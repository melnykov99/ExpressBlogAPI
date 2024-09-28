import {REPOSITORY} from "../common/constants";
import {postsCollection} from "../db/collectionsMongoDB";
import {PostDBModel, PostOutputModel} from "../types/posts";
import {DeleteResult, InsertOneResult, WithId} from "mongodb";

async function getPosts(): Promise<PostOutputModel[] | REPOSITORY.ERROR> {
    try {
        return await postsCollection.find({}, {projection: {_id: 0}}).toArray();
    } catch (error) {
        return REPOSITORY.ERROR;
    }
}

async function createPost(newPost: PostOutputModel): Promise<PostDBModel | REPOSITORY.ERROR> {
    try {
        const result: InsertOneResult<PostDBModel> = await postsCollection.insertOne(newPost as PostDBModel)
        return {
            _id: result.insertedId.toString(),
            ...newPost
        };
    } catch (error) {
        return REPOSITORY.ERROR;
    }
}

async function getPostById(postId: string): Promise<PostDBModel | REPOSITORY.NOT_FOUND | REPOSITORY.ERROR> {
    try {
        const foundPost: WithId<PostDBModel> | null = await postsCollection.findOne({id: postId}, {projection: {_id: 0}})
        if (foundPost === null) {
            return REPOSITORY.NOT_FOUND;
        }
        return foundPost;
    } catch (error) {
        return REPOSITORY.ERROR;
    }
}

async function updatePost(postId: string) {

}

async function deletePost(postId: string): Promise<REPOSITORY> {
    try {
        const deleteResult: DeleteResult = await postsCollection.deleteOne({id: postId});
        if (deleteResult.deletedCount === 0) {
            return REPOSITORY.NOT_FOUND;
        }
        return REPOSITORY.SUCCESSFULLY;
    } catch (error) {
        return REPOSITORY.ERROR;
    }
}

export default {
    getPosts,
    createPost,
    getPostById,
    updatePost,
    deletePost,
}