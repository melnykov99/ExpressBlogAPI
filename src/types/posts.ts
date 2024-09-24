type PostInputModel = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
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
type PostDBModel = {
    _id: string,
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
}

export {PostInputModel, PostOutputModel, PostDBModel}