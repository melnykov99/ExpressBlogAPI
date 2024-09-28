//Output Error object
type ErrorMessage = {
    message: string,
    field: string,
}
type ErrorsMessagesOutput = {
    errorsMessages: ErrorMessage[];
}

// Error messages
type CommonErrorMessages = {
    notEmpty: string,
    isString: string,
    isURL: string,
    isUUID: string,
}
type BlogErrorMessages = {
    nameLength: string,
    descriptionLength: string,
    websiteUrlLength: string,
}
//
enum BlogFields {
    Name = "name",
    Description = "description",
    WebsiteUrl = "websiteUrl",
}

enum PostFields {
    Title = "title",
    ShortDescription = "shortDescription",
    Content = "content",
    BlogId = "blogId",
}
// constants
type BlogConstants = {
    nameMaxLength: number,
    descriptionMaxLength: number,
    websiteUrlMaxLength: number,
}

export {ErrorMessage, ErrorsMessagesOutput, BlogFields, PostFields, CommonErrorMessages, BlogErrorMessages, BlogConstants}