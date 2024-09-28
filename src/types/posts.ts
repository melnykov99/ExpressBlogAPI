type PostInputModel = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
}
type UpdatedPostData = PostInputModel & {
    blogName: string,
}
type PostOutputModel = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
}
type PostDBModel = PostOutputModel & {
    _id: string,
}

export {PostInputModel, PostOutputModel, PostDBModel, UpdatedPostData}