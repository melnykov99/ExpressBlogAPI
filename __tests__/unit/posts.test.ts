import request from 'supertest';
import {app} from "../../src";
import postsService from "../../src/services/posts"
import {PostInputModel, PostOutputModel} from "../../src/types/posts";
import {randomUUID} from "crypto";
import {BASIC_AUTH, REPOSITORY} from "../../src/common/constants";
import {postErrorMessages, commonErrorMessages} from "../../src/validation/errorsMessages";
import {BlogOutputModel} from "../../src/types/blogs";

jest.mock('../../src/services/posts');

describe('posts routes', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });
    const mockBlog: BlogOutputModel = {
        id: randomUUID(),
        name: 'test blog',
        description: 'test description blog',
        websiteUrl: 'https://www.example.com/',
        createdAt: new Date().toISOString(),
        isMembership: false,
    }
    const mockPostInput: PostInputModel = {
        title: 'test title',
        shortDescription: 'test shortDescription',
        content: 'test content',
        blogId: mockBlog.id,
    }
    const mockPostOutput: PostOutputModel = {
        id: randomUUID(),
        title: 'test title',
        shortDescription: 'test shortDescription',
        content: 'test content',
        blogId: mockBlog.id,
        blogName: mockBlog.name,
        createdAt: new Date().toISOString()
    }
    describe('GET /posts', () => {
        it('should return status 200 and list of posts', async () => {
            const mockPosts: PostOutputModel[] = [
                {
                    id: randomUUID(),
                    title: 'test title',
                    shortDescription: 'test shortDescription',
                    content: 'test content',
                    blogId: mockBlog.id,
                    blogName: mockBlog.name,
                    createdAt: new Date().toISOString()
                },
                {
                    id: randomUUID(),
                    title: 'test title 2 ',
                    shortDescription: 'test shortDescription 2',
                    content: 'test content 2',
                    blogId: mockBlog.id,
                    blogName: mockBlog.name,
                    createdAt: new Date().toISOString()
                },
            ];
            (postsService.getPosts as jest.Mock).mockResolvedValue(mockPosts);

            const response = await request(app).get('/posts');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockPosts);
        });
        it('should return status 500 if DB return error', async () => {
            (postsService.getPosts as jest.Mock).mockResolvedValue(REPOSITORY.ERROR);

            const response = await request(app)
                .get(`/posts`)

            expect(response.status).toBe(500);
        });
    });
    describe('POST /posts', () => {
        it('should create a new post, return status 201 and created post', async () => {
            const newPostInput: PostInputModel = mockPostInput;
            const newPostOutput: PostOutputModel = mockPostOutput;

            (postsService.createPost as jest.Mock).mockResolvedValue(newPostOutput);

            const response = await request(app)
                .post('/posts')
                .set('Authorization', BASIC_AUTH)
                .send(newPostInput);

            expect(response.status).toBe(201);
            expect(response.body).toEqual(newPostOutput);
        });
        it('should return status 500 if DB return error', async () => {
            const newPostInput: PostInputModel = {
                title: 'test title',
                shortDescription: 'test shortDescription',
                content: 'test content',
                blogId: mockBlog.id,
            };
            (postsService.createPost as jest.Mock).mockResolvedValue(REPOSITORY.ERROR);

            const response = await request(app)
                .post(`/posts/`)
                .set('Authorization', BASIC_AUTH)
                .send(newPostInput)

            expect(response.status).toBe(500);
        });
    });
    describe('GET /posts/:id', () => {
        it('should return status 404 if the post does not exist', async () => {
            const nonExistentId: string = randomUUID();

            (postsService.getPostById as jest.Mock).mockResolvedValue(REPOSITORY.NOT_FOUND);

            const response = await request(app)
                .get(`/posts/${nonExistentId}`)

            expect(response.status).toBe(404);
        });
        it('should return status 200 and the post if it exists', async () => {
            const existingPost: PostOutputModel = mockPostOutput;

            (postsService.getPostById as jest.Mock).mockResolvedValue(existingPost);

            const response = await request(app)
                .get(`/posts/${existingPost.id}`)

            expect(response.status).toBe(200);
            expect(response.body).toEqual(existingPost);
        });
        it('should return status 500 if DB return error', async () => {
            const postId: string = randomUUID();
            (postsService.getPostById as jest.Mock).mockResolvedValue(REPOSITORY.ERROR);

            const response = await request(app)
                .get(`/posts/${postId}`)

            expect(response.status).toBe(500);
        });
    });
    describe('PUT /posts/:id', () => {
        it('should return status 404 if the post does not exist', async () => {
            const nonExistentId: string = randomUUID();
            const updatedPostInput: PostInputModel = mockPostInput;

            (postsService.updatePost as jest.Mock).mockResolvedValue(REPOSITORY.NOT_FOUND);

            const response = await request(app)
                .put(`/posts/${nonExistentId}`)
                .set('Authorization', BASIC_AUTH)
                .send(updatedPostInput);

            expect(response.status).toBe(404);
        });
        it('should return status 204 if the post was successfully updated and verify the update', async () => {
            const existingPostId: string = randomUUID();
            const updatedPostInput: PostInputModel = mockPostInput;

            (postsService.updatePost as jest.Mock).mockResolvedValue(REPOSITORY.SUCCESSFULLY);

            const response = await request(app)
                .put(`/posts/${existingPostId}`)
                .set('Authorization', BASIC_AUTH)
                .send(updatedPostInput);

            expect(response.status).toBe(204);

            const updatedPost: PostOutputModel = mockPostOutput;

            (postsService.getPostById as jest.Mock).mockResolvedValue(updatedPost);
            const getResponse = await request(app).get(`/posts/${existingPostId}`);
            expect(getResponse.status).toBe(200);
            expect(getResponse.body).toEqual({
                id: existingPostId,
                ...updatedPostInput,
                blogName: updatedPost.blogName,
                createdAt: expect.any(String),
            });
        });
        it('should return status 500 if DB return error', async () => {
            const postId: string = randomUUID();
            const updatedPostInput: PostInputModel = mockPostInput;

            (postsService.updatePost as jest.Mock).mockResolvedValue(REPOSITORY.ERROR);

            const response = await request(app)
                .put(`/posts/${postId}`)
                .set('Authorization', BASIC_AUTH)
                .send(updatedPostInput);

            expect(response.status).toBe(500);
        });
    });
    describe('DELETE /posts/:id', () => {
        it('should return status 404 if the post does not exist', async () => {
            const nonExistentId: string = randomUUID();
            (postsService.deletePost as jest.Mock).mockResolvedValue(REPOSITORY.NOT_FOUND);

            const response = await request(app)
                .delete(`/posts/${nonExistentId}`)
                .set('Authorization', BASIC_AUTH);

            expect(response.status).toBe(404);
        });
        it('should return status 204 if the post was successfully deleted and verify deletion', async () => {
            const existingPostId: string = randomUUID();
            const existingPost: PostOutputModel = mockPostOutput;

            (postsService.getPostById as jest.Mock).mockResolvedValueOnce(existingPost);

            let response = await request(app).get(`/posts/${existingPostId}`);
            expect(response.status).toBe(200);
            expect(response.body).toEqual(existingPost);

            (postsService.deletePost as jest.Mock).mockResolvedValue(REPOSITORY.SUCCESSFULLY);

            response = await request(app)
                .delete(`/posts/${existingPostId}`)
                .set('Authorization', BASIC_AUTH);

            expect(response.status).toBe(204);

            (postsService.getPostById as jest.Mock).mockResolvedValueOnce(REPOSITORY.NOT_FOUND);

            response = await request(app).get(`/posts/${existingPostId}`);
            expect(response.status).toBe(404);
        });
        it('should return status 500 if DB return error', async () => {
            const postId: string = randomUUID();
            (postsService.deletePost as jest.Mock).mockResolvedValue(REPOSITORY.ERROR);

            const response = await request(app)
                .delete(`/posts/${postId}`)
                .set('Authorization', BASIC_AUTH);

            expect(response.status).toBe(500);
        });
    });
    describe('posts validation', () => {
        describe('POST', () => {
            it('should return status 400 and validation errors if all fields are not strings', async () => {
                const newPostInput = {
                    title: true,
                    shortDescription: null,
                    content: [],
                    blogId: 12345,
                };

                const response = await request(app)
                    .post('/posts')
                    .set('Authorization', BASIC_AUTH)
                    .send(newPostInput);

                expect(response.status).toBe(400);
                expect(response.body).toEqual({
                    errorsMessages: [
                        {
                            message: commonErrorMessages.isString,
                            field: "title",
                        },
                        {
                            message: commonErrorMessages.isString,
                            field: "shortDescription",
                        },
                        {
                            message: commonErrorMessages.isString,
                            field: "content",
                        },
                        {
                            message: commonErrorMessages.isString,
                            field: "blogId",
                        },
                    ],
                });
            });
            it('should return status 400 and validation errors if fields are empty strings', async () => {
                const newPostInput = {
                    title: '',
                    shortDescription: ' ',
                    content: '   ',
                    blogId: '      ',
                };

                const response = await request(app)
                    .post('/posts')
                    .set('Authorization', BASIC_AUTH)
                    .send(newPostInput);

                expect(response.status).toBe(400);
                expect(response.body).toEqual({
                    errorsMessages: [
                        {
                            message: commonErrorMessages.notEmpty,
                            field: "title",
                        },
                        {
                            message: commonErrorMessages.notEmpty,
                            field: "shortDescription",
                        },
                        {
                            message: commonErrorMessages.notEmpty,
                            field: "content",
                        },
                        {
                            message: commonErrorMessages.notEmpty,
                            field: "blogId",
                        },
                    ],
                });
            });
            it('should return status 400 and validation errors if fields exceed length limits', async () => {
                const newPostInput = {
                    title: 'A'.repeat(31),
                    shortDescription: 'A'.repeat(101),
                    content: 'A'.repeat(1001),
                    blogId: randomUUID(),
                };

                const response = await request(app)
                    .post('/posts')
                    .set('Authorization', BASIC_AUTH)
                    .send(newPostInput);

                expect(response.status).toBe(400);
                expect(response.body).toEqual({
                    errorsMessages: [
                        {
                            message: postErrorMessages.titleLength,
                            field: "title",
                        },
                        {
                            message: postErrorMessages.shortDescriptionLength,
                            field: "shortDescription",
                        },
                        {
                            message: postErrorMessages.contentLength,
                            field: "content",
                        },
                    ],
                });
            });
            it('should return status 400 and validation error if websiteUrl is not a valid URL', async () => {
                const newPostInput = {
                    title: 'test title',
                    shortDescription: 'test shortDescription',
                    content: 'test content',
                    blogId: 'notValidBlogId'
                };

                const response = await request(app)
                    .post('/posts')
                    .set('Authorization', BASIC_AUTH)
                    .send(newPostInput);

                expect(response.status).toBe(400);
                expect(response.body).toEqual({
                    errorsMessages: [
                        {
                            message: commonErrorMessages.isUUID,
                            field: "blogId",
                        },
                    ],
                });
            });
        })
        describe('PUT', () => {
            const existingPostId: string = randomUUID();
            it('should return status 400 and validation errors if all fields are not strings', async () => {
                const newPostInput = {
                    title: true,
                    shortDescription: null,
                    content: [],
                    blogId: 12345,
                };

                const response = await request(app)
                    .put(`/posts/${existingPostId}`)
                    .set('Authorization', BASIC_AUTH)
                    .send(newPostInput);

                expect(response.status).toBe(400);
                expect(response.body).toEqual({
                    errorsMessages: [
                        {
                            message: commonErrorMessages.isString,
                            field: "title",
                        },
                        {
                            message: commonErrorMessages.isString,
                            field: "shortDescription",
                        },
                        {
                            message: commonErrorMessages.isString,
                            field: "content",
                        },
                        {
                            message: commonErrorMessages.isString,
                            field: "blogId",
                        },
                    ],
                });
            });
            it('should return status 400 and validation errors if fields are empty strings', async () => {
                const newPostInput = {
                    title: '',
                    shortDescription: ' ',
                    content: '   ',
                    blogId: '      ',
                };

                const response = await request(app)
                    .put(`/posts/${existingPostId}`)
                    .set('Authorization', BASIC_AUTH)
                    .send(newPostInput);

                expect(response.status).toBe(400);
                expect(response.body).toEqual({
                    errorsMessages: [
                        {
                            message: commonErrorMessages.notEmpty,
                            field: "title",
                        },
                        {
                            message: commonErrorMessages.notEmpty,
                            field: "shortDescription",
                        },
                        {
                            message: commonErrorMessages.notEmpty,
                            field: "content",
                        },
                        {
                            message: commonErrorMessages.notEmpty,
                            field: "blogId",
                        },
                    ],
                });
            });
            it('should return status 400 and validation errors if fields exceed length limits', async () => {
                const newPostInput = {
                    title: 'A'.repeat(31),
                    shortDescription: 'A'.repeat(101),
                    content: 'A'.repeat(1001),
                    blogId: existingPostId,
                };

                const response = await request(app)
                    .put(`/posts/${existingPostId}`)
                    .set('Authorization', BASIC_AUTH)
                    .send(newPostInput);

                expect(response.status).toBe(400);
                expect(response.body).toEqual({
                    errorsMessages: [
                        {
                            message: postErrorMessages.titleLength,
                            field: "title",
                        },
                        {
                            message: postErrorMessages.shortDescriptionLength,
                            field: "shortDescription",
                        },
                        {
                            message: postErrorMessages.contentLength,
                            field: "content",
                        },
                    ],
                });
            });
            it('should return status 400 and validation error if websiteUrl is not a valid URL', async () => {
                const newPostInput = {
                    title: 'test title',
                    shortDescription: 'test shortDescription',
                    content: 'test content',
                    blogId: 'notValidBlogId'
                };

                const response = await request(app)
                    .put(`/posts/${existingPostId}`)
                    .set('Authorization', BASIC_AUTH)
                    .send(newPostInput);

                expect(response.status).toBe(400);
                expect(response.body).toEqual({
                    errorsMessages: [
                        {
                            message: commonErrorMessages.isUUID,
                            field: "blogId",
                        },
                    ],
                });
            });
        })
    })
    describe('posts basic auth', () => {
        describe('POST', () => {
            it('should return 401 status without headers.Authorization', async () => {
                const response = await request(app)
                    .post('/posts')

                expect(response.status).toBe(401);
            });
            it('should return 401 status with invalid headers.Authorization', async () => {
                const response = await request(app)
                    .post('/posts')
                    .set('Authorization', 'Basic qwerty12345')

                expect(response.status).toBe(401);
            });
        })
        describe('PUT', () => {
            const existingPostId: string = randomUUID();
            it('should return 401 status without headers.Authorization', async () => {

                const response = await request(app)
                    .put(`/posts/${existingPostId}`)
                    .send(mockPostInput);

                expect(response.status).toBe(401);
            });
            it('should return 401 status with invalid headers.Authorization', async () => {

                const response = await request(app)
                    .put(`/posts/${existingPostId}`)
                    .set('Authorization', 'Basic qwerty12345')
                    .send(mockPostInput);

                expect(response.status).toBe(401);
            });
        })
        describe('DELETE', () => {
            const existingPostId: string = randomUUID();
            it('should return 401 status without headers.Authorization', async () => {
                const response = await request(app)
                    .delete(`/posts/${existingPostId}`);

                expect(response.status).toBe(401);
            });
            it('should return 401 status with invalid headers.Authorization', async () => {
                const response = await request(app)
                    .delete(`/posts/${existingPostId}`)
                    .set('Authorization', 'Basic qwerty12345');

                expect(response.status).toBe(401);
            });
        })
    })
});