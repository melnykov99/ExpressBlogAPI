import {Router} from "express";
import postsService from "../services/posts"
import {HTTP} from "../types/constants";

const postsRouter = Router();

postsRouter.get('/', async (req, res) => {
    const foundPosts = await postsService.getPosts();
    res.status(HTTP.OK).send(foundPosts);
});
postsRouter.post('/', async (req, res) => {
    const createdPost = await postsService.createPost();
    res.status(HTTP.CREATED).send(createdPost);
});
postsRouter.get('/:id', async (req, res) => {
    const postId: string = req.params.id;
    const foundPost = await postsService.getPostById(postId);
    res.status(HTTP.OK).send(foundPost);
});
postsRouter.put('/:id', async (req, res) => {
    const postId: string = req.params.id;
    const updateResult = await postsService.updatePost(postId);
    res.sendStatus(HTTP.NO_CONTENT);
});
postsRouter.delete('/:id', async (req, res) => {
    const postId: string = req.params.id;
    const deleteResult = await postsService.deletePost(postId);
    res.sendStatus(HTTP.NO_CONTENT);
});
export default postsRouter;