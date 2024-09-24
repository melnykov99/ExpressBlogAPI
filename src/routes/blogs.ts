import {Router, Request, Response} from "express";
import blogsService from "../services/blogs"
import HTTP from "../common/constants/HTTP_CODES";
import {BlogInputModel, BlogOutputModel} from "../types/blogs";

const blogsRouter = Router();

blogsRouter.get('/', async (req: Request, res: Response) => {
    const foundBlogs: BlogOutputModel[] = await blogsService.getBlogs();
    res.status(HTTP.OK).send(foundBlogs);
});
blogsRouter.post('/', async (req, res) => {
    const newBlog: BlogInputModel = req.body;
    const createdBlog = await blogsService.createBlog(newBlog);
    res.status(HTTP.CREATED).send(createdBlog);
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