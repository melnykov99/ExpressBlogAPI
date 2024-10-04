import {Request, Response, Router} from "express";
import blogsService from "../services/blogs"
import {BlogInputModel, BlogOutputModel} from "../types/blogs";
import {HTTP, REPOSITORY} from "../common/constants";
import {ParamsId, RequestWithBody, RequestWithParams, RequestWithParamsAndBody} from "../types/request";
import {basicAuth} from "../middlewares/auth/basic";
import {blogsValidationRules} from "../validation/rules/blogs";
import {validationHandler} from "../validation/validationHandler";
import {CreatePostByBlogIdInputModel, PostOutputModel} from "../types/posts";
import {createPostByBlogIdValidation} from "../validation/rules/posts";

const blogsRouter = Router();

blogsRouter.get('/', async (req: Request, res: Response<BlogOutputModel[]>) => {
    const foundBlogs: BlogOutputModel[] | REPOSITORY.ERROR = await blogsService.getBlogs();
    if (foundBlogs === REPOSITORY.ERROR) {
        res.sendStatus(HTTP.SERVER_ERROR);
        return;
    }
    res.status(HTTP.OK).send(foundBlogs);
});
blogsRouter.post('/', basicAuth, blogsValidationRules, validationHandler, async (req: RequestWithBody<BlogInputModel>, res: Response<BlogOutputModel>) => {
    const blogInput: BlogInputModel = {
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl,
    }
    const createdBlog: BlogOutputModel | REPOSITORY.ERROR = await blogsService.createBlog(blogInput);
    if (createdBlog === REPOSITORY.ERROR) {
        res.sendStatus(HTTP.SERVER_ERROR);
        return;
    }
    res.status(HTTP.CREATED).send(createdBlog);
});
blogsRouter.get('/:id', async (req: RequestWithParams<ParamsId>, res: Response<BlogOutputModel>) => {
    const blogId: string = req.params.id;
    const foundBlog: BlogOutputModel | REPOSITORY.NOT_FOUND | REPOSITORY.ERROR = await blogsService.getBlogById(blogId);
    if (foundBlog === REPOSITORY.NOT_FOUND) {
        res.sendStatus(HTTP.NOT_FOUND);
        return;
    }
    if (foundBlog === REPOSITORY.ERROR) {
        res.sendStatus(HTTP.SERVER_ERROR);
        return;
    }
    res.status(HTTP.OK).send(foundBlog);
});
blogsRouter.put('/:id', basicAuth, blogsValidationRules, validationHandler, async (req: RequestWithParamsAndBody<ParamsId, BlogInputModel>, res: Response) => {
    const blogId: string = req.params.id;
    const blogInput: BlogInputModel = {
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl,
    }
    const updateResult: REPOSITORY = await blogsService.updateBlog(blogId, blogInput);
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
blogsRouter.delete('/:id', basicAuth, async (req: RequestWithParams<ParamsId>, res: Response) => {
    const blogId: string = req.params.id;
    const deleteResult: REPOSITORY = await blogsService.deleteBlog(blogId);
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

blogsRouter.get('/:id/posts', async (req: RequestWithParams<ParamsId>, res: Response<PostOutputModel[]>) => {
    const blogId: string = req.params.id;
    const foundPosts: PostOutputModel[] | REPOSITORY.NOT_FOUND | REPOSITORY.ERROR = await blogsService.getPostsByBlogId(blogId);
    if (foundPosts === REPOSITORY.NOT_FOUND) {
        res.sendStatus(HTTP.NOT_FOUND);
        return;
    }
    if (foundPosts === REPOSITORY.ERROR) {
        res.sendStatus(HTTP.SERVER_ERROR);
        return;
    }
    res.status(HTTP.OK).send(foundPosts);
})

blogsRouter.post('/:id/posts', basicAuth, createPostByBlogIdValidation, validationHandler, async (req: RequestWithParamsAndBody<ParamsId, CreatePostByBlogIdInputModel>, res: Response<PostOutputModel>) => {
    const blogId: string = req.params.id;
    const postInput: CreatePostByBlogIdInputModel = {
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
    }
    const createdPost: PostOutputModel | REPOSITORY.NOT_FOUND | REPOSITORY.ERROR = await blogsService.createPostByBlogId(blogId, postInput);
    if (createdPost === REPOSITORY.NOT_FOUND) {
        res.sendStatus(HTTP.NOT_FOUND);
        return
    }
    if (createdPost === REPOSITORY.ERROR) {
        res.sendStatus(HTTP.SERVER_ERROR);
        return
    }
    res.status(HTTP.CREATED).send(createdPost)

})

export default blogsRouter;