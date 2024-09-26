type BlogInputModel = {
    name: string,
    description: string,
    websiteUrl: string,
}
type BlogOutputModel = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean,
}
type BlogDBModel = BlogOutputModel & {
    _id: string,
}

export {BlogInputModel, BlogOutputModel, BlogDBModel}