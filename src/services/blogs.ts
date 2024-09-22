import blogsRepository from "../repositories/blogs"
async function getBlogs() {
    return await blogsRepository.getBlogs();
}
async function createBlog() {
    return await blogsRepository.createBlog();
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