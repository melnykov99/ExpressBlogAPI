import {body, ValidationChain} from "express-validator";
import {commonErrorMessages, postErrorMessages} from "../errorsMessages";
import {post} from "../constants";
import blogsService from "../../services/blogs";
import {REPOSITORY} from "../../common/constants";
import {BlogOutputModel} from "../../types/blogs";

const postsValidationRules: ValidationChain[] = [
    body('title')
        .isString().withMessage(commonErrorMessages.isString).bail()
        .trim().notEmpty().withMessage(commonErrorMessages.notEmpty).bail()
        .isLength({max: post.titleMaxLength}).withMessage(postErrorMessages.titleLength),
    body('shortDescription')
        .isString().withMessage(commonErrorMessages.isString).bail()
        .trim().notEmpty().withMessage(commonErrorMessages.notEmpty).bail()
        .isLength({max: post.shortDescriptionMaxLength}).withMessage(postErrorMessages.shortDescriptionLength),
    body('content')
        .isString().withMessage(commonErrorMessages.isString).bail()
        .trim().notEmpty().withMessage(commonErrorMessages.notEmpty).bail()
        .isLength({max: post.contentMaxLength}).withMessage(postErrorMessages.contentLength),
    body('blogId')
        .isString().withMessage(commonErrorMessages.isString).bail()
        .trim().notEmpty().withMessage(commonErrorMessages.notEmpty).bail()
        .isUUID().withMessage(commonErrorMessages.isUUID).bail()
        .custom(async value => {
            const foundBlog: BlogOutputModel | REPOSITORY.NOT_FOUND | REPOSITORY.ERROR = await blogsService.getBlogById(value);
            if (foundBlog === REPOSITORY.NOT_FOUND || foundBlog === REPOSITORY.ERROR) {
                throw new Error('blog with this id was not found');
            }
        })
]
export {postsValidationRules}