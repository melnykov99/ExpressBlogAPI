import postsRepository from "../repositories/posts";

async function getPosts() {
    return await postsRepository.getPosts();
}
async function createPost() {
    return await postsRepository.createPost();
}
async function getPostById(postId: string) {
    return await postsRepository.getPostById(postId);
}
async function updatePost(postId: string) {
    return await postsRepository.updatePost(postId);
}
async function deletePost(postId: string) {
    return await postsRepository.deletePost(postId);
}
export default {
    getPosts,
    createPost,
    getPostById,
    updatePost,
    deletePost,
}