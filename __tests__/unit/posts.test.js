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
const posts_1 = __importDefault(require("../../src/services/posts"));
const blogs_1 = __importDefault(require("../../src/services/blogs"));
const crypto_1 = require("crypto");
const constants_1 = require("../../src/common/constants");
const errorsMessages_1 = require("../../src/validation/errorsMessages");
jest.mock('../../src/services/blogs');
jest.mock('../../src/services/posts');
describe('posts routes', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });
    const mockBlogInput = {
        name: 'test blog',
        description: 'test description blog',
        websiteUrl: 'https://www.example.com/',
    };
    const mockBlogOutput = {
        id: (0, crypto_1.randomUUID)(),
        name: 'test blog',
        description: 'test description blog',
        websiteUrl: 'https://www.example.com/',
        createdAt: new Date().toISOString(),
        isMembership: false,
    };
    const mockPostInput = {
        title: 'test title',
        shortDescription: 'test shortDescription',
        content: 'test content',
        blogId: mockBlogOutput.id,
    };
    const mockPostOutput = {
        id: (0, crypto_1.randomUUID)(),
        title: 'test title',
        shortDescription: 'test shortDescription',
        content: 'test content',
        blogId: mockBlogOutput.id,
        blogName: mockBlogOutput.name,
        createdAt: new Date().toISOString()
    };
    describe('GET /posts', () => {
        it('should return status 200 and list of posts', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockPosts = [
                {
                    id: (0, crypto_1.randomUUID)(),
                    title: 'test title',
                    shortDescription: 'test shortDescription',
                    content: 'test content',
                    blogId: mockBlogOutput.id,
                    blogName: mockBlogOutput.name,
                    createdAt: new Date().toISOString()
                },
                {
                    id: (0, crypto_1.randomUUID)(),
                    title: 'test title 2 ',
                    shortDescription: 'test shortDescription 2',
                    content: 'test content 2',
                    blogId: mockBlogOutput.id,
                    blogName: mockBlogOutput.name,
                    createdAt: new Date().toISOString()
                },
            ];
            posts_1.default.getPosts.mockResolvedValue(mockPosts);
            const response = yield (0, supertest_1.default)(src_1.app).get('/posts');
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockPosts);
        }));
        it('should return status 500 if DB return error', () => __awaiter(void 0, void 0, void 0, function* () {
            posts_1.default.getPosts.mockResolvedValue(constants_1.REPOSITORY.ERROR);
            const response = yield (0, supertest_1.default)(src_1.app)
                .get(`/posts`);
            expect(response.status).toBe(500);
        }));
    });
    describe('POST /posts', () => {
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            blogs_1.default.createBlog.mockResolvedValue(mockBlogOutput);
            yield (0, supertest_1.default)(src_1.app)
                .post('/blogs')
                .set('Authorization', constants_1.BASIC_AUTH)
                .send(mockBlogInput);
        }));
        it('should create a new post, return status 201 and created post', () => __awaiter(void 0, void 0, void 0, function* () {
            posts_1.default.createPost.mockResolvedValue(mockPostOutput);
            const response = yield (0, supertest_1.default)(src_1.app)
                .post('/posts')
                .set('Authorization', constants_1.BASIC_AUTH)
                .send(mockPostInput);
            expect(response.status).toBe(201);
            expect(response.body).toEqual(mockPostOutput);
        }));
        it('should return status 500 if DB return error', () => __awaiter(void 0, void 0, void 0, function* () {
            posts_1.default.createPost.mockResolvedValue(constants_1.REPOSITORY.ERROR);
            const response = yield (0, supertest_1.default)(src_1.app)
                .post('/posts')
                .set('Authorization', constants_1.BASIC_AUTH)
                .send(mockPostInput);
            console.log(response);
            expect(response.status).toBe(500);
        }));
    });
    describe('GET /posts/:id', () => {
        it('should return status 404 if the post does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            const nonExistentId = (0, crypto_1.randomUUID)();
            posts_1.default.getPostById.mockResolvedValue(constants_1.REPOSITORY.NOT_FOUND);
            const response = yield (0, supertest_1.default)(src_1.app)
                .get(`/posts/${nonExistentId}`);
            expect(response.status).toBe(404);
        }));
        it('should return status 200 and the post if it exists', () => __awaiter(void 0, void 0, void 0, function* () {
            posts_1.default.getPostById.mockResolvedValue(mockPostOutput);
            const response = yield (0, supertest_1.default)(src_1.app)
                .get(`/posts/${mockPostOutput.id}`);
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockPostOutput);
        }));
        it('should return status 500 if DB return error', () => __awaiter(void 0, void 0, void 0, function* () {
            const existPost = mockPostOutput;
            posts_1.default.getPostById.mockResolvedValue(constants_1.REPOSITORY.ERROR);
            const response = yield (0, supertest_1.default)(src_1.app)
                .get(`/posts/${existPost.id}`);
            expect(response.status).toBe(500);
        }));
    });
    describe('PUT /posts/:id', () => {
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            blogs_1.default.createBlog.mockResolvedValue(mockBlogOutput);
            yield (0, supertest_1.default)(src_1.app)
                .post('/blogs')
                .set('Authorization', constants_1.BASIC_AUTH)
                .send(mockBlogInput);
        }));
        it('should return status 404 if the post does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            posts_1.default.updatePost.mockResolvedValue(constants_1.REPOSITORY.NOT_FOUND);
            const response = yield (0, supertest_1.default)(src_1.app)
                .put(`/posts/${mockPostOutput.id}`)
                .set('Authorization', constants_1.BASIC_AUTH)
                .send(mockPostInput);
            expect(response.status).toBe(404);
        }));
        it('should return status 204 if the post was successfully updated and verify the update', () => __awaiter(void 0, void 0, void 0, function* () {
            const existBlog = {
                id: (0, crypto_1.randomUUID)(),
                name: 'not updated blog name',
                description: 'test description blog',
                websiteUrl: 'https://www.example.com/',
                createdAt: new Date().toISOString(),
                isMembership: false,
            };
            const existPost = {
                id: (0, crypto_1.randomUUID)(),
                title: 'not updated title',
                shortDescription: 'not updated shortDescription',
                content: 'not updated content',
                blogId: existBlog.id,
                blogName: existBlog.name,
                createdAt: new Date().toISOString()
            };
            const updatedPost = {
                id: existPost.id,
                title: mockPostOutput.title,
                shortDescription: mockPostOutput.shortDescription,
                content: mockPostOutput.content,
                blogId: mockPostInput.blogId,
                blogName: mockPostOutput.blogName,
                createdAt: existPost.createdAt,
            };
            posts_1.default.updatePost.mockResolvedValue(constants_1.REPOSITORY.SUCCESSFULLY);
            const response = yield (0, supertest_1.default)(src_1.app)
                .put(`/posts/${existPost.id}`)
                .set('Authorization', constants_1.BASIC_AUTH)
                .send(mockPostInput);
            expect(response.status).toBe(204);
            posts_1.default.getPostById.mockResolvedValue(updatedPost);
            const getResponse = yield (0, supertest_1.default)(src_1.app).get(`/posts/${mockPostOutput.id}`);
            expect(getResponse.status).toBe(200);
            expect(getResponse.body).toEqual(Object.assign(Object.assign({ id: existPost.id }, mockPostInput), { blogName: mockPostOutput.blogName, createdAt: expect.any(String) }));
        }));
        it('should return status 500 if DB return error', () => __awaiter(void 0, void 0, void 0, function* () {
            posts_1.default.updatePost.mockResolvedValue(constants_1.REPOSITORY.ERROR);
            const response = yield (0, supertest_1.default)(src_1.app)
                .put(`/posts/${mockPostOutput.id}`)
                .set('Authorization', constants_1.BASIC_AUTH)
                .send(mockPostInput);
            expect(response.status).toBe(500);
        }));
    });
    describe('DELETE /posts/:id', () => {
        it('should return status 404 if the post does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            const nonExistentId = (0, crypto_1.randomUUID)();
            posts_1.default.deletePost.mockResolvedValue(constants_1.REPOSITORY.NOT_FOUND);
            const response = yield (0, supertest_1.default)(src_1.app)
                .delete(`/posts/${nonExistentId}`)
                .set('Authorization', constants_1.BASIC_AUTH);
            expect(response.status).toBe(404);
        }));
        it('should return status 204 if the post was successfully deleted and verify deletion', () => __awaiter(void 0, void 0, void 0, function* () {
            const existingPostId = (0, crypto_1.randomUUID)();
            const existingPost = mockPostOutput;
            posts_1.default.getPostById.mockResolvedValueOnce(existingPost);
            let response = yield (0, supertest_1.default)(src_1.app).get(`/posts/${existingPostId}`);
            expect(response.status).toBe(200);
            expect(response.body).toEqual(existingPost);
            posts_1.default.deletePost.mockResolvedValue(constants_1.REPOSITORY.SUCCESSFULLY);
            response = yield (0, supertest_1.default)(src_1.app)
                .delete(`/posts/${existingPostId}`)
                .set('Authorization', constants_1.BASIC_AUTH);
            expect(response.status).toBe(204);
            posts_1.default.getPostById.mockResolvedValueOnce(constants_1.REPOSITORY.NOT_FOUND);
            response = yield (0, supertest_1.default)(src_1.app).get(`/posts/${existingPostId}`);
            expect(response.status).toBe(404);
        }));
        it('should return status 500 if DB return error', () => __awaiter(void 0, void 0, void 0, function* () {
            const postId = (0, crypto_1.randomUUID)();
            posts_1.default.deletePost.mockResolvedValue(constants_1.REPOSITORY.ERROR);
            const response = yield (0, supertest_1.default)(src_1.app)
                .delete(`/posts/${postId}`)
                .set('Authorization', constants_1.BASIC_AUTH);
            expect(response.status).toBe(500);
        }));
    });
    describe('posts validation', () => {
        describe('POST', () => {
            it('should return status 400 and validation errors if all fields are not strings', () => __awaiter(void 0, void 0, void 0, function* () {
                const newPostInput = {
                    title: true,
                    shortDescription: null,
                    content: [],
                    blogId: 12345,
                };
                const response = yield (0, supertest_1.default)(src_1.app)
                    .post('/posts')
                    .set('Authorization', constants_1.BASIC_AUTH)
                    .send(newPostInput);
                expect(response.status).toBe(400);
                expect(response.body).toEqual({
                    errorsMessages: [
                        {
                            message: errorsMessages_1.commonErrorMessages.isString,
                            field: "title",
                        },
                        {
                            message: errorsMessages_1.commonErrorMessages.isString,
                            field: "shortDescription",
                        },
                        {
                            message: errorsMessages_1.commonErrorMessages.isString,
                            field: "content",
                        },
                        {
                            message: errorsMessages_1.commonErrorMessages.isString,
                            field: "blogId",
                        },
                    ],
                });
            }));
            it('should return status 400 and validation errors if fields are empty strings', () => __awaiter(void 0, void 0, void 0, function* () {
                const newPostInput = {
                    title: '',
                    shortDescription: ' ',
                    content: '   ',
                    blogId: '      ',
                };
                const response = yield (0, supertest_1.default)(src_1.app)
                    .post('/posts')
                    .set('Authorization', constants_1.BASIC_AUTH)
                    .send(newPostInput);
                expect(response.status).toBe(400);
                expect(response.body).toEqual({
                    errorsMessages: [
                        {
                            message: errorsMessages_1.commonErrorMessages.notEmpty,
                            field: "title",
                        },
                        {
                            message: errorsMessages_1.commonErrorMessages.notEmpty,
                            field: "shortDescription",
                        },
                        {
                            message: errorsMessages_1.commonErrorMessages.notEmpty,
                            field: "content",
                        },
                        {
                            message: errorsMessages_1.commonErrorMessages.notEmpty,
                            field: "blogId",
                        },
                    ],
                });
            }));
            it('should return status 400 and validation errors if fields exceed length limits', () => __awaiter(void 0, void 0, void 0, function* () {
                blogs_1.default.createBlog.mockResolvedValue(mockBlogOutput);
                yield (0, supertest_1.default)(src_1.app)
                    .post('/blogs')
                    .set('Authorization', constants_1.BASIC_AUTH)
                    .send(mockBlogInput);
                const newPostInput = {
                    title: 'A'.repeat(31),
                    shortDescription: 'A'.repeat(101),
                    content: 'A'.repeat(1001),
                    blogId: mockBlogOutput.id,
                };
                const response = yield (0, supertest_1.default)(src_1.app)
                    .post('/posts')
                    .set('Authorization', constants_1.BASIC_AUTH)
                    .send(newPostInput);
                expect(response.status).toBe(400);
                expect(response.body).toEqual({
                    errorsMessages: [
                        {
                            message: errorsMessages_1.postErrorMessages.titleLength,
                            field: "title",
                        },
                        {
                            message: errorsMessages_1.postErrorMessages.shortDescriptionLength,
                            field: "shortDescription",
                        },
                        {
                            message: errorsMessages_1.postErrorMessages.contentLength,
                            field: "content",
                        },
                    ],
                });
            }));
            it('should return status 400 and validation error if websiteUrl is not a valid URL', () => __awaiter(void 0, void 0, void 0, function* () {
                const newPostInput = {
                    title: 'test title',
                    shortDescription: 'test shortDescription',
                    content: 'test content',
                    blogId: 'notValidBlogId'
                };
                const response = yield (0, supertest_1.default)(src_1.app)
                    .post('/posts')
                    .set('Authorization', constants_1.BASIC_AUTH)
                    .send(newPostInput);
                expect(response.status).toBe(400);
                expect(response.body).toEqual({
                    errorsMessages: [
                        {
                            message: errorsMessages_1.commonErrorMessages.isUUID,
                            field: "blogId",
                        },
                    ],
                });
            }));
        });
        describe('PUT', () => {
            const existingPostId = (0, crypto_1.randomUUID)();
            it('should return status 400 and validation errors if all fields are not strings', () => __awaiter(void 0, void 0, void 0, function* () {
                const newPostInput = {
                    title: true,
                    shortDescription: null,
                    content: [],
                    blogId: 12345,
                };
                const response = yield (0, supertest_1.default)(src_1.app)
                    .put(`/posts/${existingPostId}`)
                    .set('Authorization', constants_1.BASIC_AUTH)
                    .send(newPostInput);
                expect(response.status).toBe(400);
                expect(response.body).toEqual({
                    errorsMessages: [
                        {
                            message: errorsMessages_1.commonErrorMessages.isString,
                            field: "title",
                        },
                        {
                            message: errorsMessages_1.commonErrorMessages.isString,
                            field: "shortDescription",
                        },
                        {
                            message: errorsMessages_1.commonErrorMessages.isString,
                            field: "content",
                        },
                        {
                            message: errorsMessages_1.commonErrorMessages.isString,
                            field: "blogId",
                        },
                    ],
                });
            }));
            it('should return status 400 and validation errors if fields are empty strings', () => __awaiter(void 0, void 0, void 0, function* () {
                const newPostInput = {
                    title: '',
                    shortDescription: ' ',
                    content: '   ',
                    blogId: '      ',
                };
                const response = yield (0, supertest_1.default)(src_1.app)
                    .put(`/posts/${existingPostId}`)
                    .set('Authorization', constants_1.BASIC_AUTH)
                    .send(newPostInput);
                expect(response.status).toBe(400);
                expect(response.body).toEqual({
                    errorsMessages: [
                        {
                            message: errorsMessages_1.commonErrorMessages.notEmpty,
                            field: "title",
                        },
                        {
                            message: errorsMessages_1.commonErrorMessages.notEmpty,
                            field: "shortDescription",
                        },
                        {
                            message: errorsMessages_1.commonErrorMessages.notEmpty,
                            field: "content",
                        },
                        {
                            message: errorsMessages_1.commonErrorMessages.notEmpty,
                            field: "blogId",
                        },
                    ],
                });
            }));
            it('should return status 400 and validation errors if fields exceed length limits', () => __awaiter(void 0, void 0, void 0, function* () {
                blogs_1.default.createBlog.mockResolvedValue(mockBlogOutput);
                yield (0, supertest_1.default)(src_1.app)
                    .post('/blogs')
                    .set('Authorization', constants_1.BASIC_AUTH)
                    .send(mockBlogInput);
                const newPostInput = {
                    title: 'A'.repeat(31),
                    shortDescription: 'A'.repeat(101),
                    content: 'A'.repeat(1001),
                    blogId: mockBlogOutput.id,
                };
                const response = yield (0, supertest_1.default)(src_1.app)
                    .put(`/posts/${existingPostId}`)
                    .set('Authorization', constants_1.BASIC_AUTH)
                    .send(newPostInput);
                expect(response.status).toBe(400);
                expect(response.body).toEqual({
                    errorsMessages: [
                        {
                            message: errorsMessages_1.postErrorMessages.titleLength,
                            field: "title",
                        },
                        {
                            message: errorsMessages_1.postErrorMessages.shortDescriptionLength,
                            field: "shortDescription",
                        },
                        {
                            message: errorsMessages_1.postErrorMessages.contentLength,
                            field: "content",
                        },
                    ],
                });
            }));
            it('should return status 400 and validation error if websiteUrl is not a valid URL', () => __awaiter(void 0, void 0, void 0, function* () {
                const newPostInput = {
                    title: 'test title',
                    shortDescription: 'test shortDescription',
                    content: 'test content',
                    blogId: 'notValidBlogId'
                };
                const response = yield (0, supertest_1.default)(src_1.app)
                    .put(`/posts/${existingPostId}`)
                    .set('Authorization', constants_1.BASIC_AUTH)
                    .send(newPostInput);
                expect(response.status).toBe(400);
                expect(response.body).toEqual({
                    errorsMessages: [
                        {
                            message: errorsMessages_1.commonErrorMessages.isUUID,
                            field: "blogId",
                        },
                    ],
                });
            }));
        });
    });
    describe('posts basic auth', () => {
        describe('POST', () => {
            it('should return 401 status without headers.Authorization', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(src_1.app)
                    .post('/posts');
                expect(response.status).toBe(401);
            }));
            it('should return 401 status with invalid headers.Authorization', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(src_1.app)
                    .post('/posts')
                    .set('Authorization', 'Basic qwerty12345');
                expect(response.status).toBe(401);
            }));
        });
        describe('PUT', () => {
            const existingPostId = (0, crypto_1.randomUUID)();
            it('should return 401 status without headers.Authorization', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(src_1.app)
                    .put(`/posts/${existingPostId}`)
                    .send(mockPostInput);
                expect(response.status).toBe(401);
            }));
            it('should return 401 status with invalid headers.Authorization', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(src_1.app)
                    .put(`/posts/${existingPostId}`)
                    .set('Authorization', 'Basic qwerty12345')
                    .send(mockPostInput);
                expect(response.status).toBe(401);
            }));
        });
        describe('DELETE', () => {
            const existingPostId = (0, crypto_1.randomUUID)();
            it('should return 401 status without headers.Authorization', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(src_1.app)
                    .delete(`/posts/${existingPostId}`);
                expect(response.status).toBe(401);
            }));
            it('should return 401 status with invalid headers.Authorization', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(src_1.app)
                    .delete(`/posts/${existingPostId}`)
                    .set('Authorization', 'Basic qwerty12345');
                expect(response.status).toBe(401);
            }));
        });
    });
});
