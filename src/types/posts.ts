type CreatePostByBlogIdInputModel = {
    title: string,
    shortDescription: string,
    content: string,
}
type PostInputModel = CreatePostByBlogIdInputModel & {
    blogId: string,
}
type UpdatedPostData = PostInputModel & {
    blogName: string,
}
type PostOutputModel = PostInputModel & {
    id: string,
    blogName: string,
    createdAt: string,
}
type PostDBModel = PostOutputModel & {
    _id: string,
}
type PostsResponseModel = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: PostOutputModel[],
}

export {PostInputModel, PostOutputModel, PostDBModel, UpdatedPostData, CreatePostByBlogIdInputModel, PostsResponseModel}