import {Router} from "express";
import blogsService from "../services/blogs"
import HTTP from "../common/constants/HTTP_CODES";

const blogsRouter = Router();

blogsRouter.get('/', async (req, res) => {
    const foundBlogs = await blogsService.getBlogs();
    res.status(HTTP.OK).send(foundBlogs);
});
blogsRouter.post('/', async (req, res) => {
    const createdBlog = await blogsService.createBlog();
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