import {BlogConstants, PostConstants} from "../types/validation";

const blog: BlogConstants = {
    nameMaxLength: 15,
    descriptionMaxLength: 500,
    websiteUrlMaxLength: 100,
}
const post: PostConstants = {
    titleMaxLength: 30,
    shortDescriptionMaxLength: 100,
    contentMaxLength: 1000
}

export {blog, post}