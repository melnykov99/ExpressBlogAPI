import {blog, post} from "./constants";
import {BlogErrorMessages, CommonErrorMessages, PostErrorMessages} from "../types/validation";

const commonErrorMessages: CommonErrorMessages = {
    notEmpty: "field should not be empty",
    isString: "field should be a string",
    isURL: "field should be a link in url format",
    isUUID: "field should be in the uuid format",
}
const blogErrorMessages: BlogErrorMessages = {
    nameLength:  `length field should not exceed ${blog.nameMaxLength} characters`,
    descriptionLength: `length field should not exceed ${blog.descriptionMaxLength} characters`,
    websiteUrlLength:  `length field should not exceed ${blog.websiteUrlMaxLength} characters`,
}
const postErrorMessages: PostErrorMessages = {
    titleLength: `length field should not exceed ${post.titleMaxLength} characters`,
    shortDescriptionLength: `length field should not exceed ${post.shortDescriptionMaxLength} characters`,
    contentLength: `length field should not exceed ${post.contentMaxLength} characters`,
}

export {commonErrorMessages, blogErrorMessages, postErrorMessages}