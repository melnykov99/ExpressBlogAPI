import blogsRepository from "../repositories/blogs"
import {BlogInputModel, BlogOutputModel} from "../types/blogs";
async function getBlogs(): Promise<BlogOutputModel[]> {
    return await blogsRepository.getBlogs();
}
async function createBlog(newBlog: BlogInputModel) {
    return await blogsRepository.createBlog(newBlog);
}
async function getBlogById(blogId: string) {
    return await blogsRepository.getBlogById(blogId);
}
async function updateBlog(blogId: string) {
    return await blogsRepository.updateBlog(blogId);
}
async function deleteBlog(blogId: string) {
    return await blogsRepository.deleteBlog(blogId);
}

export default {
    getBlogs,
    createBlog,
    getBlogById,
    updateBlog,
    deleteBlog,
}