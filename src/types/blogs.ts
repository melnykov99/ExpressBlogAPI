type BlogInputModel = {
    name: string,
    description: string,
    websiteUrl: string,
}
type BlogOutputModel = BlogInputModel & {
    id: string,
    createdAt: string,
    isMembership: boolean,
}
type BlogDBModel = BlogOutputModel & {
    _id: string,
}
type BlogsResponseModel = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: BlogOutputModel[],
}

export {BlogInputModel, BlogOutputModel, BlogDBModel, BlogsResponseModel}