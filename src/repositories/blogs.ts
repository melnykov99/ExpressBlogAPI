import {blogsCollection} from "../db/collectionsMongoDB";
import {BlogDBModel, BlogInputModel, BlogOutputModel} from "../types/blogs";
import {REPOSITORY} from "../common/constants";
import {DeleteResult, InsertOneResult, UpdateResult, WithId} from "mongodb";

async function getBlogs(): Promise<BlogOutputModel[] | REPOSITORY.ERROR> {
    try {
        return blogsCollection.find({}, {projection: {_id: 0}}).toArray();
    } catch (error) {
        return REPOSITORY.ERROR;
    }
}

async function createBlog(newBlog: BlogOutputModel): Promise<BlogDBModel | REPOSITORY.ERROR> {
    try {
        const createResult: InsertOneResult<BlogDBModel> = await blogsCollection.insertOne(newBlog as BlogDBModel);
        return {
            _id: createResult.insertedId.toString(),
            ...newBlog
        };
    } catch (error) {
        return REPOSITORY.ERROR;
    }
}

async function getBlogById(blogId: string): Promise<BlogOutputModel | REPOSITORY.NOT_FOUND | REPOSITORY.ERROR> {
    try {
        const foundBlog: WithId<BlogDBModel> | null = await blogsCollection.findOne({id: blogId}, {projection: {_id: 0}});
        if (foundBlog === null) {
            return REPOSITORY.NOT_FOUND;
        }
        return foundBlog
    } catch (error) {
        return REPOSITORY.ERROR
    }
}

async function updateBlog(blogId: string, blogInput: BlogInputModel): Promise<REPOSITORY> {
    try {
        const updateResult: UpdateResult<BlogDBModel> = await blogsCollection.updateOne({id: blogId}, {
            $set: {
                name: blogInput.name,
                description: blogInput.description,
                websiteUrl: blogInput.websiteUrl
            }
        })
        if (updateResult.matchedCount === 0) {
            return REPOSITORY.NOT_FOUND;
        }
        return REPOSITORY.SUCCESSFULLY;
    } catch (error) {
        return REPOSITORY.ERROR;
    }
}

async function deleteBlog(blogId: string): Promise<REPOSITORY> {
    try {
        const deleteResult: DeleteResult = await blogsCollection.deleteOne({id: blogId});
        if (deleteResult.deletedCount === 0) {
            return REPOSITORY.NOT_FOUND;
        }
        return REPOSITORY.SUCCESSFULLY;
    } catch (error) {
        return REPOSITORY.ERROR;
    }
}

export default {
    getBlogs,
    createBlog,
    getBlogById,
    updateBlog,
    deleteBlog,
}