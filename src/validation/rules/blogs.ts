import {body, ValidationChain} from "express-validator";
import {blogErrorMessages, commonErrorMessages} from "../errorsMessages";
import {blog} from "../constants";

const blogsValidationRules: ValidationChain[] = [
    body('name')
        .isString().withMessage(commonErrorMessages.isString).bail()
        .trim().notEmpty().withMessage(commonErrorMessages.notEmpty).bail()
        .isLength({ max: blog.nameMaxLength }).withMessage(blogErrorMessages.nameLength),
    body('description')
        .isString().withMessage(commonErrorMessages.isString).bail()
        .trim().notEmpty().withMessage(commonErrorMessages.notEmpty).bail()
        .isLength({ max: blog.descriptionMaxLength }).withMessage(blogErrorMessages.descriptionLength),
    body('websiteUrl')
        .isString().withMessage(commonErrorMessages.isString).bail()
        .trim().notEmpty().withMessage(commonErrorMessages.notEmpty).bail()
        .isLength({ max: blog.websiteUrlMaxLength }).withMessage(blogErrorMessages.websiteUrlLength).bail()
        .isURL().withMessage(commonErrorMessages.isURL)
];

export {blogsValidationRules};