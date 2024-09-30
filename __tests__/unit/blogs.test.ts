import request from 'supertest';
import {app} from "../../src";
import blogsService from "../../src/services/blogs"
import {BlogInputModel, BlogOutputModel} from "../../src/types/blogs";
import {randomUUID} from "crypto";
import {BASIC_AUTH, REPOSITORY} from "../../src/common/constants";
import {blogErrorMessages, commonErrorMessages} from "../../src/validation/errorsMessages";

jest.mock('../../src/services/blogs');

describe('blogs routes', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });
    describe('GET /blogs', () => {
        it('should return status 200 and list of blogs', async () => {
            const mockBlogs: BlogOutputModel[] = [
                {
                    id: randomUUID(),
                    name: 'test blog',
                    description: 'test description blog',
                    websiteUrl: 'https://www.example.com/',
                    createdAt: new Date().toISOString(),
                    isMembership: false,
                },
                {
                    id: randomUUID(),
                    name: 'test blog 2',
                    description: 'test description blog 2',
                    websiteUrl: 'https://www.example2.com/',
                    createdAt: new Date().toISOString(),
                    isMembership: false,
                },
            ];
            (blogsService.getBlogs as jest.Mock).mockResolvedValue(mockBlogs);

            const response = await request(app).get('/blogs');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockBlogs);
        });
        it('should return status 500 if DB return error', async () => {
            (blogsService.getBlogs as jest.Mock).mockResolvedValue(REPOSITORY.ERROR);

            const response = await request(app)
                .get(`/blogs`)

            expect(response.status).toBe(500);
        });
    });
    describe('POST /blogs', () => {
        it('should create a new blog, return status 201 and created blog', async () => {
            const newBlogInput: BlogInputModel = {
                name: 'test blog',
                description: 'test description blog',
                websiteUrl: 'https://www.example.com/',
            };

            const newBlogOutput: BlogOutputModel = {
                id: randomUUID(),
                name: newBlogInput.name,
                description: newBlogInput.description,
                websiteUrl: newBlogInput.websiteUrl,
                createdAt: new Date().toISOString(),
                isMembership: false,
            };

            (blogsService.createBlog as jest.Mock).mockResolvedValue(newBlogOutput);

            const response = await request(app)
                .post('/blogs')
                .set('Authorization', BASIC_AUTH)
                .send(newBlogInput);

            expect(response.status).toBe(201);
            expect(response.body).toEqual(newBlogOutput);
        });
        it('should return status 500 if DB return error', async () => {
            const newBlogInput: BlogInputModel = {
                name: 'test blog',
                description: 'test description blog',
                websiteUrl: 'https://www.example.com/',
            };
            (blogsService.createBlog as jest.Mock).mockResolvedValue(REPOSITORY.ERROR);

            const response = await request(app)
                .post(`/blogs/`)
                .set('Authorization', BASIC_AUTH)
                .send(newBlogInput)

            expect(response.status).toBe(500);
        });
    });
    describe('GET /blogs/:id', () => {
        it('should return status 404 if the blog does not exist', async () => {
            const nonExistentId: string = randomUUID();

            (blogsService.getBlogById as jest.Mock).mockResolvedValue(REPOSITORY.NOT_FOUND);

            const response = await request(app)
                .get(`/blogs/${nonExistentId}`)

            expect(response.status).toBe(404);
        });
        it('should return status 200 and the blog if it exists', async () => {
            const existingBlog: BlogOutputModel = {
                id: randomUUID(),
                name: 'Existing Blog',
                description: 'This blog exists.',
                websiteUrl: 'https://www.example.com',
                createdAt: new Date().toISOString(),
                isMembership: false,
            };

            (blogsService.getBlogById as jest.Mock).mockResolvedValue(existingBlog);

            const response = await request(app)
                .get(`/blogs/${existingBlog.id}`)

            expect(response.status).toBe(200);
            expect(response.body).toEqual(existingBlog);
        });
        it('should return status 500 if DB return error', async () => {
            const blogId: string = randomUUID();
            (blogsService.getBlogById as jest.Mock).mockResolvedValue(REPOSITORY.ERROR);

            const response = await request(app)
                .get(`/blogs/${blogId}`)

            expect(response.status).toBe(500);
        });
    });
    describe('PUT /blogs/:id', () => {
        it('should return status 404 if the blog does not exist', async () => {
            const nonExistentId: string = randomUUID();
            const updatedBlogInput: BlogInputModel = {
                name: 'Updated Blog',
                description: 'This blog has been updated.',
                websiteUrl: 'https://www.updated-example.com',
            };

            (blogsService.updateBlog as jest.Mock).mockResolvedValue(REPOSITORY.NOT_FOUND);

            const response = await request(app)
                .put(`/blogs/${nonExistentId}`)
                .set('Authorization', BASIC_AUTH)
                .send(updatedBlogInput);

            expect(response.status).toBe(404);
        });
        it('should return status 204 if the blog was successfully updated and verify the update', async () => {
            const existingBlogId: string = randomUUID();
            const updatedBlogInput: BlogInputModel = {
                name: 'Updated Blog',
                description: 'This blog has been updated.',
                websiteUrl: 'https://www.updated-example.com',
            };

            (blogsService.updateBlog as jest.Mock).mockResolvedValue(REPOSITORY.SUCCESSFULLY);

            const response = await request(app)
                .put(`/blogs/${existingBlogId}`)
                .set('Authorization', BASIC_AUTH)
                .send(updatedBlogInput);

            expect(response.status).toBe(204);

            const updatedBlog: BlogOutputModel = {
                id: existingBlogId,
                name: updatedBlogInput.name,
                description: updatedBlogInput.description,
                websiteUrl: updatedBlogInput.websiteUrl,
                createdAt: new Date().toISOString(),
                isMembership: false,
            };

            (blogsService.getBlogById as jest.Mock).mockResolvedValue(updatedBlog);
            const getResponse = await request(app).get(`/blogs/${existingBlogId}`);
            expect(getResponse.status).toBe(200);
            expect(getResponse.body).toEqual({
                id: existingBlogId,
                ...updatedBlogInput,
                createdAt: expect.any(String),
                isMembership: false,
            });
        });
        it('should return status 500 if DB return error', async () => {
            const blogId: string = randomUUID();
            const updatedBlogInput: BlogInputModel = {
                name: 'Updated Blog',
                description: 'This blog has been updated.',
                websiteUrl: 'https://www.updated-example.com',
            };

            (blogsService.updateBlog as jest.Mock).mockResolvedValue(REPOSITORY.ERROR);

            const response = await request(app)
                .put(`/blogs/${blogId}`)
                .set('Authorization', BASIC_AUTH)
                .send(updatedBlogInput);

            expect(response.status).toBe(500);
        });
    });
    describe('DELETE /blogs/:id', () => {
        it('should return status 404 if the blog does not exist', async () => {
            const nonExistentId: string = randomUUID();
            (blogsService.deleteBlog as jest.Mock).mockResolvedValue(REPOSITORY.NOT_FOUND);

            const response = await request(app)
                .delete(`/blogs/${nonExistentId}`)
                .set('Authorization', BASIC_AUTH);

            expect(response.status).toBe(404);
        });
        it('should return status 204 if the blog was successfully deleted and verify deletion', async () => {
            const existingBlogId: string = randomUUID();
            const existingBlog: BlogOutputModel = {
                id: randomUUID(),
                name: 'test blog',
                description: 'test description blog',
                websiteUrl: 'https://www.example.com/',
                createdAt: new Date().toISOString(),
                isMembership: false,
            };
            (blogsService.getBlogById as jest.Mock).mockResolvedValue(existingBlog);
            let response = await request(app).get(`/blogs/${existingBlogId}`);
            expect(response.status).toBe(200);
            expect(response.body).toEqual(existingBlog);


            (blogsService.deleteBlog as jest.Mock).mockResolvedValue(REPOSITORY.SUCCESSFULLY);

            response = await request(app)
                .delete(`/blogs/${existingBlogId}`)
                .set('Authorization', BASIC_AUTH);

            expect(response.status).toBe(204);

            (blogsService.getBlogById as jest.Mock).mockResolvedValueOnce(REPOSITORY.NOT_FOUND);

            response = await request(app).get(`/blogs/${existingBlogId}`);
            expect(response.status).toBe(404);
        });
        it('should return status 500 if DB return error', async () => {
            const blogId: string = randomUUID();
            (blogsService.deleteBlog as jest.Mock).mockResolvedValue(REPOSITORY.ERROR);

            const response = await request(app)
                .delete(`/blogs/${blogId}`)
                .set('Authorization', BASIC_AUTH);

            expect(response.status).toBe(500);
        });
    });
    describe('blogs validation', () => {
        describe('POST', () => {
            it('should return status 400 and validation errors if all fields are not strings', async () => {
                const newBlogInput = {
                    name: true,
                    description: null,
                    websiteUrl: [],
                };

                const response = await request(app)
                    .post('/blogs')
                    .set('Authorization', BASIC_AUTH)
                    .send(newBlogInput);

                expect(response.status).toBe(400);
                expect(response.body).toEqual({
                    errorsMessages: [
                        {
                            message: commonErrorMessages.isString,
                            field: "name",
                        },
                        {
                            message: commonErrorMessages.isString,
                            field: "description",
                        },
                        {
                            message: commonErrorMessages.isString,
                            field: "websiteUrl",
                        },
                    ],
                });
            });
            it('should return status 400 and validation errors if fields are empty strings', async () => {
                const newBlogInput = {
                    name: '',
                    description: ' ',
                    websiteUrl: '    ',
                };

                const response = await request(app)
                    .post('/blogs')
                    .set('Authorization', BASIC_AUTH)
                    .send(newBlogInput);

                expect(response.status).toBe(400);
                expect(response.body).toEqual({
                    errorsMessages: [
                        {
                            message: commonErrorMessages.notEmpty,
                            field: "name",
                        },
                        {
                            message: commonErrorMessages.notEmpty,
                            field: "description",
                        },
                        {
                            message: commonErrorMessages.notEmpty,
                            field: "websiteUrl",
                        },
                    ],
                });
            });
            it('should return status 400 and validation errors if fields exceed length limits', async () => {
                const newBlogInput = {
                    name: 'This name is way too long!',
                    description: 'A'.repeat(501),
                    websiteUrl: 'https://www.example.com/' + 'a'.repeat(90),
                };

                const response = await request(app)
                    .post('/blogs')
                    .set('Authorization', BASIC_AUTH)
                    .send(newBlogInput);

                expect(response.status).toBe(400);
                expect(response.body).toEqual({
                    errorsMessages: [
                        {
                            message: blogErrorMessages.nameLength,
                            field: "name",
                        },
                        {
                            message: blogErrorMessages.descriptionLength,
                            field: "description",
                        },
                        {
                            message: blogErrorMessages.websiteUrlLength,
                            field: "websiteUrl",
                        },
                    ],
                });
            });
            it('should return status 400 and validation error if websiteUrl is not a valid URL', async () => {
                const newBlogInput = {
                    name: 'Test Blog',
                    description: 'This is a valid description.',
                    websiteUrl: 'not_a_valid_url',
                };

                const response = await request(app)
                    .post('/blogs')
                    .set('Authorization', BASIC_AUTH)
                    .send(newBlogInput);

                expect(response.status).toBe(400);
                expect(response.body).toEqual({
                    errorsMessages: [
                        {
                            message: commonErrorMessages.isURL,
                            field: "websiteUrl",
                        },
                    ],
                });
            });
        })
        describe('PUT', () => {
            it('should return status 400 and validation errors if all fields are not strings', async () => {
                const existingBlogId: string = randomUUID();
                const updatedBlogInput = {
                    name: true,
                    description: null,
                    websiteUrl: [],
                };

                const response = await request(app)
                    .put(`/blogs/${existingBlogId}`)
                    .set('Authorization', BASIC_AUTH)
                    .send(updatedBlogInput);

                expect(response.status).toBe(400);
                expect(response.body).toEqual({
                    errorsMessages: [
                        {
                            message: commonErrorMessages.isString,
                            field: "name",
                        },
                        {
                            message: commonErrorMessages.isString,
                            field: "description",
                        },
                        {
                            message: commonErrorMessages.isString,
                            field: "websiteUrl",
                        },
                    ],
                });
            });
            it('should return status 400 and validation errors if fields are empty strings', async () => {
                const existingBlogId: string = randomUUID();
                const updatedBlogInput = {
                    name: '',
                    description: ' ',
                    websiteUrl: '    ',
                };

                const response = await request(app)
                    .put(`/blogs/${existingBlogId}`)
                    .set('Authorization', BASIC_AUTH)
                    .send(updatedBlogInput);

                expect(response.status).toBe(400);
                expect(response.body).toEqual({
                    errorsMessages: [
                        {
                            message: commonErrorMessages.notEmpty,
                            field: "name",
                        },
                        {
                            message: commonErrorMessages.notEmpty,
                            field: "description",
                        },
                        {
                            message: commonErrorMessages.notEmpty,
                            field: "websiteUrl",
                        },
                    ],
                });
            });
            it('should return status 400 and validation errors if fields exceed length limits', async () => {
                const existingBlogId: string = randomUUID();
                const updatedBlogInput = {
                    name: 'This name is way too long!',
                    description: 'A'.repeat(501),
                    websiteUrl: 'https://www.example.com/' + 'a'.repeat(90),
                };

                const response = await request(app)
                    .put(`/blogs/${existingBlogId}`)
                    .set('Authorization', BASIC_AUTH)
                    .send(updatedBlogInput);

                expect(response.status).toBe(400);
                expect(response.body).toEqual({
                    errorsMessages: [
                        {
                            message: blogErrorMessages.nameLength,
                            field: "name",
                        },
                        {
                            message: blogErrorMessages.descriptionLength,
                            field: "description",
                        },
                        {
                            message: blogErrorMessages.websiteUrlLength,
                            field: "websiteUrl",
                        },
                    ],
                });
            });
            it('should return status 400 and validation error if websiteUrl is not a valid URL', async () => {
                const existingBlogId: string = randomUUID();
                const updatedBlogInput = {
                    name: 'Test Blog',
                    description: 'This is a valid description.',
                    websiteUrl: 'not_a_valid_url',
                };

                const response = await request(app)
                    .put(`/blogs/${existingBlogId}`)
                    .set('Authorization', BASIC_AUTH)
                    .send(updatedBlogInput);

                expect(response.status).toBe(400);
                expect(response.body).toEqual({
                    errorsMessages: [
                        {
                            message: commonErrorMessages.isURL,
                            field: "websiteUrl",
                        },
                    ],
                });
            });
        })
    })
    describe('blogs basic auth', () => {
        describe('POST', () => {
            it('should return 401 status without headers.Authorization', async () => {
                const response = await request(app)
                    .post('/blogs')

                expect(response.status).toBe(401);
            });
            it('should return 401 status with invalid headers.Authorization', async () => {
                const response = await request(app)
                    .post('/blogs')
                    .set('Authorization', 'Basic qwerty12345')

                expect(response.status).toBe(401);
            });
        })
        describe('PUT', () => {
            it('should return 401 status without headers.Authorization', async () => {
                const existingBlogId: string = randomUUID();
                const updatedBlogInput: BlogInputModel = {
                    name: 'Updated Blog',
                    description: 'This blog has been updated.',
                    websiteUrl: 'https://www.updated-example.com',
                };

                const response = await request(app)
                    .put(`/blogs/${existingBlogId}`)
                    .send(updatedBlogInput);

                expect(response.status).toBe(401);
            });
            it('should return 401 status with invalid headers.Authorization', async () => {
                const existingBlogId: string = randomUUID();
                const updatedBlogInput: BlogInputModel = {
                    name: 'Updated Blog',
                    description: 'This blog has been updated.',
                    websiteUrl: 'https://www.updated-example.com',
                };

                const response = await request(app)
                    .put(`/blogs/${existingBlogId}`)
                    .set('Authorization', 'Basic qwerty12345')
                    .send(updatedBlogInput);

                expect(response.status).toBe(401);
            });
        })
        describe('DELETE', () => {
            it('should return 401 status without headers.Authorization', async () => {
                const existingBlogId: string = randomUUID();
                const response = await request(app)
                    .delete(`/blogs/${existingBlogId}`);

                expect(response.status).toBe(401);
            });
            it('should return 401 status with invalid headers.Authorization', async () => {
                const existingBlogId: string = randomUUID();
                const response = await request(app)
                    .delete(`/blogs/${existingBlogId}`)
                    .set('Authorization', 'Basic qwerty12345');

                expect(response.status).toBe(401);
            });
        })
    })
});