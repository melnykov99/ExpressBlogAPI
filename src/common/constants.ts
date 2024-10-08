enum HTTP {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    NOT_FOUND = 404,
    SERVER_ERROR = 500,
}

enum REPOSITORY {
    SUCCESSFULLY = "SUCCESSFULLY",
    ERROR = "ERROR",
    NOT_FOUND = "NOT_FOUND",
}
const BASIC_AUTH: string = "Basic YWRtaW46cXdlcnR5";

export {HTTP, REPOSITORY, BASIC_AUTH}