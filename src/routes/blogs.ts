import {Request, Response, Router} from "express";
import blogsService from "../services/blogs"
import {BlogInputModel, BlogOutputModel} from "../types/blogs";
import {HTTP, REPOSITORY} from "../types/constants";

const blogsRouter = Router();

blogsRouter.get('/', async (req: Request, res: Response) => {
    const foundBlogs: BlogOutputModel[] | REPOSITORY.ERROR = await blogsService.getBlogs();
    if (foundBlogs === REPOSITORY.ERROR) {
        res.sendStatus(HTTP.SERVER_ERROR);
        return;
    }
    res.status(HTTP.OK).send(foundBlogs);
});
blogsRouter.post('/', async (req, res) => {
    const blogInput: BlogInputModel = {
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl,
    }
    const createResult: BlogOutputModel | REPOSITORY.ERROR = await blogsService.createBlog(blogInput);
    if (createResult === REPOSITORY.ERROR) {
        res.sendStatus(HTTP.SERVER_ERROR);
        return;
    }
    res.status(HTTP.CREATED).send(createResult);
});
blogsRouter.get('/:id', async (req, res) => {
    const blogId: string = req.params.id;
    const foundBlog = await blogsService.getBlogById(blogId);
    res.status(HTTP.OK).send(foundBlog);
});
blogsRouter.put('/:id', async (req, res) => {
    const blogId: string = req.params.id;
    const updateResult = await blogsService.updateBlog(blogId);
    res.sendStatus(HTTP.NO_CONTENT);
});
blogsRouter.delete('/:id', async (req, res) => {
    const blogId: string = req.params.id;
    const deleteResult = await blogsService.deleteBlog(blogId);
    res.sendStatus(HTTP.NO_CONTENT);
});

export default blogsRouter;