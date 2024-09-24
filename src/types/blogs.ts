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
type BlogDBModel = {
    _id: string,
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean,
}

export {BlogInputModel, BlogOutputModel, BlogDBModel}