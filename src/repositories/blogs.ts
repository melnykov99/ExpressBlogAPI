import {blogsCollection} from "../db/collectionsMongoDB";
import {BlogDBModel, BlogOutputModel} from "../types/blogs";
import {REPOSITORY} from "../types/constants";
import {InsertOneResult} from "mongodb";

async function getBlogs(): Promise<BlogOutputModel[] | REPOSITORY.ERROR> {
    try {
        return blogsCollection.find({}, {projection: {_id: 0}}).toArray();
    } catch (error) {
        return REPOSITORY.ERROR;
    }
}

async function createBlog(newBlog: BlogOutputModel): Promise<BlogDBModel | REPOSITORY.ERROR> {
    try {
        const result: InsertOneResult<BlogDBModel> = await blogsCollection.insertOne(newBlog as BlogDBModel);
        return {
            _id: result.insertedId.toString(),
            ...newBlog
        };
    } catch (error) {
        return REPOSITORY.ERROR;
    }
}

async function getBlogById(blogId: string) {

}

async function updateBlog(blogId: string) {

}

async function deleteBlog(blogId: string) {

}

export default {
    getBlogs,
    createBlog,
    getBlogById,
    updateBlog,
    deleteBlog,
}