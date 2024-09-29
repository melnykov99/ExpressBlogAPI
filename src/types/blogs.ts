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

export {BlogInputModel, BlogOutputModel, BlogDBModel}