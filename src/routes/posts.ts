import {Request, Response, Router} from "express";
import postsService from "../services/posts"
import {HTTP, REPOSITORY} from "../common/constants";
import {PostInputModel, PostOutputModel} from "../types/posts";
import {ParamsId, RequestWithBody, RequestWithParams, RequestWithParamsAndBody} from "../types/request";
import {basicAuth} from "../middlewares/auth/basic";
import {postsValidationRules} from "../validation/rules/posts";
import {validationHandler} from "../validation/validationHandler";

const postsRouter = Router();

postsRouter.get('/', async (req: Request, res: Response<PostOutputModel[]>) => {
    const foundPosts: PostOutputModel[] | REPOSITORY.ERROR = await postsService.getPosts();
    if (foundPosts === REPOSITORY.ERROR) {
        res.sendStatus(HTTP.SERVER_ERROR);
        return;
    }
    res.status(HTTP.OK).send(foundPosts);
});
postsRouter.post('/', basicAuth, postsValidationRules, validationHandler, async (req: RequestWithBody<PostInputModel>, res: Response<PostOutputModel>) => {
    const postInput: PostInputModel = {
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId: req.body.blogId,
    }
    const createdPost: PostOutputModel | REPOSITORY.NOT_FOUND | REPOSITORY.ERROR = await postsService.createPost(postInput);
    if (createdPost === REPOSITORY.NOT_FOUND) {
        // Bad Request if not found blog
        res.sendStatus(HTTP.BAD_REQUEST);
        return;
    }
    if (createdPost === REPOSITORY.ERROR) {
        res.sendStatus(HTTP.SERVER_ERROR);
        return;
    }
    res.status(HTTP.CREATED).send(createdPost);
});
postsRouter.get('/:id', async (req: RequestWithParams<ParamsId>, res: Response<PostOutputModel>) => {
    const postId: string = req.params.id;
    const foundPost: PostOutputModel | REPOSITORY.NOT_FOUND | REPOSITORY.ERROR = await postsService.getPostById(postId);
    if (foundPost === REPOSITORY.NOT_FOUND) {
        res.sendStatus(HTTP.NOT_FOUND);
        return;
    }
    if (foundPost === REPOSITORY.ERROR) {
        res.sendStatus(HTTP.SERVER_ERROR);
        return;
    }
    res.status(HTTP.OK).send(foundPost);
});
postsRouter.put('/:id', basicAuth, postsValidationRules, validationHandler, async (req: RequestWithParamsAndBody<ParamsId, PostInputModel>, res: Response) => {
    const postId: string = req.params.id;
    const postInput: PostInputModel = {
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId: req.body.blogId,
    }
    const updateResult: REPOSITORY = await postsService.updatePost(postId, postInput);
    if (updateResult === REPOSITORY.NOT_FOUND) {
        res.sendStatus(HTTP.NOT_FOUND);
        return;
    }
    if (updateResult === REPOSITORY.ERROR) {
        res.sendStatus(HTTP.SERVER_ERROR);
        return;
    }
    res.sendStatus(HTTP.NO_CONTENT);
});
postsRouter.delete('/:id', basicAuth, async (req: RequestWithParams<ParamsId>, res: Response) => {
    const postId: string = req.params.id;
    const deleteResult: REPOSITORY = await postsService.deletePost(postId);
    if (deleteResult === REPOSITORY.NOT_FOUND) {
        res.sendStatus(HTTP.NOT_FOUND);
        return;
    }
    if (deleteResult === REPOSITORY.ERROR) {
        res.sendStatus(HTTP.SERVER_ERROR);
        return;
    }
    res.sendStatus(HTTP.NO_CONTENT);
});
export default postsRouter;