import {blogsCollection} from "../db/collectionsMongoDB";
import {BlogOutputModel} from "../types/blogs";
import {REPOSITORY} from "../types/constants";

async function getBlogs(): Promise<BlogOutputModel[] | REPOSITORY.ERROR> {
    try {
        return blogsCollection.find({}, {projection: {_id: 0}}).toArray();
    } catch (error) {
        return REPOSITORY.ERROR;
    }
}

async function createBlog(newBlog: any) {
    await blogsCollection.insertOne(newBlog);
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