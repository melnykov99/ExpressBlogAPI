import postsRepository from "../repositories/posts";
import {PostDBModel, PostInputModel, PostOutputModel, UpdatedPostData} from "../types/posts";
import {REPOSITORY} from "../common/constants";
import {randomUUID} from "crypto";
import blogsService from "./blogs";
import {BlogOutputModel} from "../types/blogs";

async function getPosts(): Promise<PostOutputModel[] | REPOSITORY.ERROR> {
    return await postsRepository.getPosts();
}

async function createPost(postInput: PostInputModel): Promise<PostOutputModel | REPOSITORY.NOT_FOUND | REPOSITORY.ERROR> {
    const foundBlog: BlogOutputModel | REPOSITORY.NOT_FOUND | REPOSITORY.ERROR = await blogsService.getBlogById(postInput.blogId);
    if (foundBlog === REPOSITORY.NOT_FOUND || foundBlog === REPOSITORY.ERROR) {
        return foundBlog;
    }

    const newPost: PostOutputModel = {
        id: randomUUID(),
        title: postInput.title,
        shortDescription: postInput.shortDescription,
        content: postInput.content,
        blogId: postInput.blogId,
        blogName: foundBlog.name,
        createdAt: new Date().toISOString(),
    }
    const createdPost: PostDBModel | REPOSITORY.ERROR = await postsRepository.createPost(newPost);
    if (createdPost === REPOSITORY.ERROR) {
        return REPOSITORY.ERROR;
    }
    const {_id, ...postWithoutMongoId} = createdPost;
    return postWithoutMongoId;
}

async function getPostById(postId: string): Promise<PostOutputModel | REPOSITORY.NOT_FOUND | REPOSITORY.ERROR> {
    return await postsRepository.getPostById(postId);
}

async function updatePost(postId: string, postInput: PostInputModel): Promise<REPOSITORY> {
    console.log('hello')
    const foundBlog: BlogOutputModel | REPOSITORY.NOT_FOUND | REPOSITORY.ERROR = await blogsService.getBlogById(postInput.blogId);
    if (foundBlog === REPOSITORY.NOT_FOUND || foundBlog === REPOSITORY.ERROR) {
        console.log('here')
        return foundBlog;
    }
    const updatedPostData: UpdatedPostData = {
        ...postInput,
        blogName: foundBlog.name,
    }
    return await postsRepository.updatePost(postId, updatedPostData);
}

async function deletePost(postId: string): Promise<REPOSITORY> {
    return await postsRepository.deletePost(postId);
}

export default {
    getPosts,
    createPost,
    getPostById,
    updatePost,
    deletePost,
}