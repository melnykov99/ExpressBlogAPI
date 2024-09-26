import blogsRepository from "../repositories/blogs"
import {BlogDBModel, BlogInputModel, BlogOutputModel} from "../types/blogs";
import {REPOSITORY} from "../types/constants";
import {randomUUID} from "crypto";

async function getBlogs(): Promise<BlogOutputModel[] | REPOSITORY.ERROR> {
    return await blogsRepository.getBlogs();
}

async function createBlog(blogInput: BlogInputModel) {
    const newBlog: BlogOutputModel = {
        id: randomUUID(),
        name: blogInput.name,
        description: blogInput.description,
        websiteUrl: blogInput.websiteUrl,
        createdAt: new Date().toISOString(),
        isMembership: false,
    }
    const createdBlog: BlogDBModel | REPOSITORY.ERROR = await blogsRepository.createBlog(newBlog);
    if (createdBlog === REPOSITORY.ERROR) {
        return createdBlog;
    }
    const {_id, ...blogWithoutMongoId} = createdBlog;
    return blogWithoutMongoId;
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