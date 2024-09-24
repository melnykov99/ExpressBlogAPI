import {blogsCollection} from "../db/collectionsMongoDB";
import {BlogOutputModel} from "../types/blogs";

async function getBlogs(): Promise<BlogOutputModel[]> {
    return blogsCollection.find({}, {projection: {_id: 0}}).toArray();
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