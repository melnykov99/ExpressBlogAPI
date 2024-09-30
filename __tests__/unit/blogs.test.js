"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const src_1 = require("../../src");
const blogs_1 = __importDefault(require("../../src/services/blogs"));
const crypto_1 = require("crypto");
const constants_1 = require("../../src/common/constants");
const errorsMessages_1 = require("../../src/validation/errorsMessages");
jest.mock('../../src/services/blogs');
describe('blogs routes', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });
    describe('GET /blogs', () => {
        it('should return status 200 and list of blogs', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockBlogs = [
                {
                    id: (0, crypto_1.randomUUID)(),
                    name: 'test blog',
                    description: 'test description blog',
                    websiteUrl: 'https://www.example.com/',
                    createdAt: new Date().toISOString(),
                    isMembership: false,
                },
                {
                    id: (0, crypto_1.randomUUID)(),
                    name: 'test blog 2',
                    description: 'test description blog 2',
                    websiteUrl: 'https://www.example2.com/',
                    createdAt: new Date().toISOString(),
                    isMembership: false,
                },
            ];
            blogs_1.default.getBlogs.mockResolvedValue(mockBlogs);
            const response = yield (0, supertest_1.default)(src_1.app).get('/blogs');
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockBlogs);
        }));
        it('should return status 500 if DB return error', () => __awaiter(void 0, void 0, void 0, function* () {
            blogs_1.default.getBlogs.mockResolvedValue(constants_1.REPOSITORY.ERROR);
            const response = yield (0, supertest_1.default)(src_1.app)
                .get(`/blogs`);
            expect(response.status).toBe(500);
        }));
    });
    describe('POST /blogs', () => {
        it('should create a new blog, return status 201 and created blog', () => __awaiter(void 0, void 0, void 0, function* () {
            const newBlogInput = {
                name: 'test blog',
                description: 'test description blog',
                websiteUrl: 'https://www.example.com/',
            };
            const newBlogOutput = {
                id: (0, crypto_1.randomUUID)(),
                name: newBlogInput.name,
                description: newBlogInput.description,
                websiteUrl: newBlogInput.websiteUrl,
                createdAt: new Date().toISOString(),
                isMembership: false,
            };
            blogs_1.default.createBlog.mockResolvedValue(newBlogOutput);
            const response = yield (0, supertest_1.default)(src_1.app)
                .post('/blogs')
                .set('Authorization', constants_1.BASIC_AUTH)
                .send(newBlogInput);
            expect(response.status).toBe(201);
            expect(response.body).toEqual(newBlogOutput);
        }));
        it('should return status 500 if DB return error', () => __awaiter(void 0, void 0, void 0, function* () {
            const newBlogInput = {
                name: 'test blog',
                description: 'test description blog',
                websiteUrl: 'https://www.example.com/',
            };
            blogs_1.default.createBlog.mockResolvedValue(constants_1.REPOSITORY.ERROR);
            const response = yield (0, supertest_1.default)(src_1.app)
                .post(`/blogs/`)
                .set('Authorization', constants_1.BASIC_AUTH)
                .send(newBlogInput);
            expect(response.status).toBe(500);
        }));
    });
    describe('GET /blogs/:id', () => {
        it('should return status 404 if the blog does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            const nonExistentId = (0, crypto_1.randomUUID)();
            blogs_1.default.getBlogById.mockResolvedValue(constants_1.REPOSITORY.NOT_FOUND);
            const response = yield (0, supertest_1.default)(src_1.app)
                .get(`/blogs/${nonExistentId}`);
            expect(response.status).toBe(404);
        }));
        it('should return status 200 and the blog if it exists', () => __awaiter(void 0, void 0, void 0, function* () {
            const existingBlog = {
                id: (0, crypto_1.randomUUID)(),
                name: 'Existing Blog',
                description: 'This blog exists.',
                websiteUrl: 'https://www.example.com',
                createdAt: new Date().toISOString(),
                isMembership: false,
            };
            blogs_1.default.getBlogById.mockResolvedValue(existingBlog);
            const response = yield (0, supertest_1.default)(src_1.app)
                .get(`/blogs/${existingBlog.id}`);
            expect(response.status).toBe(200);
            expect(response.body).toEqual(existingBlog);
        }));
        it('should return status 500 if DB return error', () => __awaiter(void 0, void 0, void 0, function* () {
            const blogId = (0, crypto_1.randomUUID)();
            blogs_1.default.getBlogById.mockResolvedValue(constants_1.REPOSITORY.ERROR);
            const response = yield (0, supertest_1.default)(src_1.app)
                .get(`/blogs/${blogId}`);
            expect(response.status).toBe(500);
        }));
    });
    describe('PUT /blogs/:id', () => {
        it('should return status 404 if the blog does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            const nonExistentId = (0, crypto_1.randomUUID)();
            const updatedBlogInput = {
                name: 'Updated Blog',
                description: 'This blog has been updated.',
                websiteUrl: 'https://www.updated-example.com',
            };
            blogs_1.default.updateBlog.mockResolvedValue(constants_1.REPOSITORY.NOT_FOUND);
            const response = yield (0, supertest_1.default)(src_1.app)
                .put(`/blogs/${nonExistentId}`)
                .set('Authorization', constants_1.BASIC_AUTH)
                .send(updatedBlogInput);
            expect(response.status).toBe(404);
        }));
        it('should return status 204 if the blog was successfully updated and verify the update', () => __awaiter(void 0, void 0, void 0, function* () {
            const existingBlogId = (0, crypto_1.randomUUID)();
            const updatedBlogInput = {
                name: 'Updated Blog',
                description: 'This blog has been updated.',
                websiteUrl: 'https://www.updated-example.com',
            };
            blogs_1.default.updateBlog.mockResolvedValue(constants_1.REPOSITORY.SUCCESSFULLY);
            const response = yield (0, supertest_1.default)(src_1.app)
                .put(`/blogs/${existingBlogId}`)
                .set('Authorization', constants_1.BASIC_AUTH)
                .send(updatedBlogInput);
            expect(response.status).toBe(204);
            const updatedBlog = {
                id: existingBlogId,
                name: updatedBlogInput.name,
                description: updatedBlogInput.description,
                websiteUrl: updatedBlogInput.websiteUrl,
                createdAt: new Date().toISOString(),
                isMembership: false,
            };
            blogs_1.default.getBlogById.mockResolvedValue(updatedBlog);
            const getResponse = yield (0, supertest_1.default)(src_1.app).get(`/blogs/${existingBlogId}`);
            expect(getResponse.status).toBe(200);
            expect(getResponse.body).toEqual(Object.assign(Object.assign({ id: existingBlogId }, updatedBlogInput), { createdAt: expect.any(String), isMembership: false }));
        }));
        it('should return status 500 if DB return error', () => __awaiter(void 0, void 0, void 0, function* () {
            const blogId = (0, crypto_1.randomUUID)();
            const updatedBlogInput = {
                name: 'Updated Blog',
                description: 'This blog has been updated.',
                websiteUrl: 'https://www.updated-example.com',
            };
            blogs_1.default.updateBlog.mockResolvedValue(constants_1.REPOSITORY.ERROR);
            const response = yield (0, supertest_1.default)(src_1.app)
                .put(`/blogs/${blogId}`)
                .set('Authorization', constants_1.BASIC_AUTH)
                .send(updatedBlogInput);
            expect(response.status).toBe(500);
        }));
    });
    describe('DELETE /blogs/:id', () => {
        it('should return status 404 if the blog does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            const nonExistentId = (0, crypto_1.randomUUID)();
            blogs_1.default.deleteBlog.mockResolvedValue(constants_1.REPOSITORY.NOT_FOUND);
            const response = yield (0, supertest_1.default)(src_1.app)
                .delete(`/blogs/${nonExistentId}`)
                .set('Authorization', constants_1.BASIC_AUTH);
            expect(response.status).toBe(404);
        }));
        it('should return status 204 if the blog was successfully deleted and verify deletion', () => __awaiter(void 0, void 0, void 0, function* () {
            const existingBlogId = (0, crypto_1.randomUUID)();
            const existingBlog = {
                id: (0, crypto_1.randomUUID)(),
                name: 'test blog',
                description: 'test description blog',
                websiteUrl: 'https://www.example.com/',
                createdAt: new Date().toISOString(),
                isMembership: false,
            };
            blogs_1.default.getBlogById.mockResolvedValue(existingBlog);
            let response = yield (0, supertest_1.default)(src_1.app).get(`/blogs/${existingBlogId}`);
            expect(response.status).toBe(200);
            expect(response.body).toEqual(existingBlog);
            blogs_1.default.deleteBlog.mockResolvedValue(constants_1.REPOSITORY.SUCCESSFULLY);
            response = yield (0, supertest_1.default)(src_1.app)
                .delete(`/blogs/${existingBlogId}`)
                .set('Authorization', constants_1.BASIC_AUTH);
            expect(response.status).toBe(204);
            blogs_1.default.getBlogById.mockResolvedValueOnce(constants_1.REPOSITORY.NOT_FOUND);
            response = yield (0, supertest_1.default)(src_1.app).get(`/blogs/${existingBlogId}`);
            expect(response.status).toBe(404);
        }));
        it('should return status 500 if DB return error', () => __awaiter(void 0, void 0, void 0, function* () {
            const blogId = (0, crypto_1.randomUUID)();
            blogs_1.default.deleteBlog.mockResolvedValue(constants_1.REPOSITORY.ERROR);
            const response = yield (0, supertest_1.default)(src_1.app)
                .delete(`/blogs/${blogId}`)
                .set('Authorization', constants_1.BASIC_AUTH);
            expect(response.status).toBe(500);
        }));
    });
    describe('blogs validation', () => {
        describe('POST', () => {
            it('should return status 400 and validation errors if all fields are not strings', () => __awaiter(void 0, void 0, void 0, function* () {
                const newBlogInput = {
                    name: true,
                    description: null,
                    websiteUrl: [],
                };
                const response = yield (0, supertest_1.default)(src_1.app)
                    .post('/blogs')
                    .set('Authorization', constants_1.BASIC_AUTH)
                    .send(newBlogInput);
                expect(response.status).toBe(400);
                expect(response.body).toEqual({
                    errorsMessages: [
                        {
                            message: errorsMessages_1.commonErrorMessages.isString,
                            field: "name",
                        },
                        {
                            message: errorsMessages_1.commonErrorMessages.isString,
                            field: "description",
                        },
                        {
                            message: errorsMessages_1.commonErrorMessages.isString,
                            field: "websiteUrl",
                        },
                    ],
                });
            }));
            it('should return status 400 and validation errors if fields are empty strings', () => __awaiter(void 0, void 0, void 0, function* () {
                const newBlogInput = {
                    name: '',
                    description: ' ',
                    websiteUrl: '    ',
                };
                const response = yield (0, supertest_1.default)(src_1.app)
                    .post('/blogs')
                    .set('Authorization', constants_1.BASIC_AUTH)
                    .send(newBlogInput);
                expect(response.status).toBe(400);
                expect(response.body).toEqual({
                    errorsMessages: [
                        {
                            message: errorsMessages_1.commonErrorMessages.notEmpty,
                            field: "name",
                        },
                        {
                            message: errorsMessages_1.commonErrorMessages.notEmpty,
                            field: "description",
                        },
                        {
                            message: errorsMessages_1.commonErrorMessages.notEmpty,
                            field: "websiteUrl",
                        },
                    ],
                });
            }));
            it('should return status 400 and validation errors if fields exceed length limits', () => __awaiter(void 0, void 0, void 0, function* () {
                const newBlogInput = {
                    name: 'This name is way too long!',
                    description: 'A'.repeat(501),
                    websiteUrl: 'https://www.example.com/' + 'a'.repeat(90),
                };
                const response = yield (0, supertest_1.default)(src_1.app)
                    .post('/blogs')
                    .set('Authorization', constants_1.BASIC_AUTH)
                    .send(newBlogInput);
                expect(response.status).toBe(400);
                expect(response.body).toEqual({
                    errorsMessages: [
                        {
                            message: errorsMessages_1.blogErrorMessages.nameLength,
                            field: "name",
                        },
                        {
                            message: errorsMessages_1.blogErrorMessages.descriptionLength,
                            field: "description",
                        },
                        {
                            message: errorsMessages_1.blogErrorMessages.websiteUrlLength,
                            field: "websiteUrl",
                        },
                    ],
                });
            }));
            it('should return status 400 and validation error if websiteUrl is not a valid URL', () => __awaiter(void 0, void 0, void 0, function* () {
                const newBlogInput = {
                    name: 'Test Blog',
                    description: 'This is a valid description.',
                    websiteUrl: 'not_a_valid_url',
                };
                const response = yield (0, supertest_1.default)(src_1.app)
                    .post('/blogs')
                    .set('Authorization', constants_1.BASIC_AUTH)
                    .send(newBlogInput);
                expect(response.status).toBe(400);
                expect(response.body).toEqual({
                    errorsMessages: [
                        {
                            message: errorsMessages_1.commonErrorMessages.isURL,
                            field: "websiteUrl",
                        },
                    ],
                });
            }));
        });
        describe('PUT', () => {
            it('should return status 400 and validation errors if all fields are not strings', () => __awaiter(void 0, void 0, void 0, function* () {
                const existingBlogId = (0, crypto_1.randomUUID)();
                const updatedBlogInput = {
                    name: true,
                    description: null,
                    websiteUrl: [],
                };
                const response = yield (0, supertest_1.default)(src_1.app)
                    .put(`/blogs/${existingBlogId}`)
                    .set('Authorization', constants_1.BASIC_AUTH)
                    .send(updatedBlogInput);
                expect(response.status).toBe(400);
                expect(response.body).toEqual({
                    errorsMessages: [
                        {
                            message: errorsMessages_1.commonErrorMessages.isString,
                            field: "name",
                        },
                        {
                            message: errorsMessages_1.commonErrorMessages.isString,
                            field: "description",
                        },
                        {
                            message: errorsMessages_1.commonErrorMessages.isString,
                            field: "websiteUrl",
                        },
                    ],
                });
            }));
            it('should return status 400 and validation errors if fields are empty strings', () => __awaiter(void 0, void 0, void 0, function* () {
                const existingBlogId = (0, crypto_1.randomUUID)();
                const updatedBlogInput = {
                    name: '',
                    description: ' ',
                    websiteUrl: '    ',
                };
                const response = yield (0, supertest_1.default)(src_1.app)
                    .put(`/blogs/${existingBlogId}`)
                    .set('Authorization', constants_1.BASIC_AUTH)
                    .send(updatedBlogInput);
                expect(response.status).toBe(400);
                expect(response.body).toEqual({
                    errorsMessages: [
                        {
                            message: errorsMessages_1.commonErrorMessages.notEmpty,
                            field: "name",
                        },
                        {
                            message: errorsMessages_1.commonErrorMessages.notEmpty,
                            field: "description",
                        },
                        {
                            message: errorsMessages_1.commonErrorMessages.notEmpty,
                            field: "websiteUrl",
                        },
                    ],
                });
            }));
            it('should return status 400 and validation errors if fields exceed length limits', () => __awaiter(void 0, void 0, void 0, function* () {
                const existingBlogId = (0, crypto_1.randomUUID)();
                const updatedBlogInput = {
                    name: 'This name is way too long!',
                    description: 'A'.repeat(501),
                    websiteUrl: 'https://www.example.com/' + 'a'.repeat(90),
                };
                const response = yield (0, supertest_1.default)(src_1.app)
                    .put(`/blogs/${existingBlogId}`)
                    .set('Authorization', constants_1.BASIC_AUTH)
                    .send(updatedBlogInput);
                expect(response.status).toBe(400);
                expect(response.body).toEqual({
                    errorsMessages: [
                        {
                            message: errorsMessages_1.blogErrorMessages.nameLength,
                            field: "name",
                        },
                        {
                            message: errorsMessages_1.blogErrorMessages.descriptionLength,
                            field: "description",
                        },
                        {
                            message: errorsMessages_1.blogErrorMessages.websiteUrlLength,
                            field: "websiteUrl",
                        },
                    ],
                });
            }));
            it('should return status 400 and validation error if websiteUrl is not a valid URL', () => __awaiter(void 0, void 0, void 0, function* () {
                const existingBlogId = (0, crypto_1.randomUUID)();
                const updatedBlogInput = {
                    name: 'Test Blog',
                    description: 'This is a valid description.',
                    websiteUrl: 'not_a_valid_url',
                };
                const response = yield (0, supertest_1.default)(src_1.app)
                    .put(`/blogs/${existingBlogId}`)
                    .set('Authorization', constants_1.BASIC_AUTH)
                    .send(updatedBlogInput);
                expect(response.status).toBe(400);
                expect(response.body).toEqual({
                    errorsMessages: [
                        {
                            message: errorsMessages_1.commonErrorMessages.isURL,
                            field: "websiteUrl",
                        },
                    ],
                });
            }));
        });
    });
    describe('blogs basic auth', () => {
        describe('POST', () => {
            it('should return 401 status without headers.Authorization', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(src_1.app)
                    .post('/blogs');
                expect(response.status).toBe(401);
            }));
            it('should return 401 status with invalid headers.Authorization', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(src_1.app)
                    .post('/blogs')
                    .set('Authorization', 'Basic qwerty12345');
                expect(response.status).toBe(401);
            }));
        });
        describe('PUT', () => {
            it('should return 401 status without headers.Authorization', () => __awaiter(void 0, void 0, void 0, function* () {
                const existingBlogId = (0, crypto_1.randomUUID)();
                const updatedBlogInput = {
                    name: 'Updated Blog',
                    description: 'This blog has been updated.',
                    websiteUrl: 'https://www.updated-example.com',
                };
                const response = yield (0, supertest_1.default)(src_1.app)
                    .put(`/blogs/${existingBlogId}`)
                    .send(updatedBlogInput);
                expect(response.status).toBe(401);
            }));
            it('should return 401 status with invalid headers.Authorization', () => __awaiter(void 0, void 0, void 0, function* () {
                const existingBlogId = (0, crypto_1.randomUUID)();
                const updatedBlogInput = {
                    name: 'Updated Blog',
                    description: 'This blog has been updated.',
                    websiteUrl: 'https://www.updated-example.com',
                };
                const response = yield (0, supertest_1.default)(src_1.app)
                    .put(`/blogs/${existingBlogId}`)
                    .set('Authorization', 'Basic qwerty12345')
                    .send(updatedBlogInput);
                expect(response.status).toBe(401);
            }));
        });
        describe('DELETE', () => {
            it('should return 401 status without headers.Authorization', () => __awaiter(void 0, void 0, void 0, function* () {
                const existingBlogId = (0, crypto_1.randomUUID)();
                const response = yield (0, supertest_1.default)(src_1.app)
                    .delete(`/blogs/${existingBlogId}`);
                expect(response.status).toBe(401);
            }));
            it('should return 401 status with invalid headers.Authorization', () => __awaiter(void 0, void 0, void 0, function* () {
                const existingBlogId = (0, crypto_1.randomUUID)();
                const response = yield (0, supertest_1.default)(src_1.app)
                    .delete(`/blogs/${existingBlogId}`)
                    .set('Authorization', 'Basic qwerty12345');
                expect(response.status).toBe(401);
            }));
        });
    });
});
