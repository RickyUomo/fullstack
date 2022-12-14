jest.setTimeout(100000);
const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcrypt')

const app = require('../app');
const api = supertest(app);
const helper = require('./test_helper');
const Blog = require('../models/Blog');
const User = require('../models/User');
const { MONGODB_URI } = require('../utils/config');

describe('addition of a blog', () => {
    let token;
    beforeEach(async () => {
        await mongoose.connect(MONGODB_URI); // prevent delete before connecting to the DB
        await User.deleteMany({});
        await Blog.deleteMany({});

        const passwordHash = await bcrypt.hash('passwordisgod', 10);
        const user = new User({ username: 'root', passwordHash });

        await user.save();

        const response = await api
            .post('/api/login')
            .send({ username: 'root', password: 'passwordisgod' });

        token = response.body.token;
    });


    test('succeeds if content valid', async () => {
        const blogsAtStart = await helper.blogsInDb();
        const newBlog = {
            title: 'Benefits of Scrumban',
            author: 'Kalle Ilves',
            url: 'www.google.com',
            likes: 7
        };

        await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `bearer ${token}`)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const blogsAtEnd = await helper.blogsInDb();
        expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1);

        const titles = blogsAtEnd.map(b => b.title);
        expect(titles).toContain('Benefits of Scrumban');
    });

    test('fails if title and url missing', async () => {
        const newBlog = {
            author: 'Kalle Ilves',
            likes: 7
        };

        await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `bearer ${token}`)
            .expect(400)
            .expect('Content-Type', /application\/json/);
    });
});

// beforeEach(async () => {
//     await Blog.deleteMany({});
//     await User.deleteMany({});

//     // let blogObject = new Blog(helper.initialBlogs[0]);
//     // await blogObject.save();
//     // blogObject = new Blog(helper.initialBlogs[1]);
//     // await blogObject.save();

//     const blogObjects = helper.initialBlogs.map(b => new Blog(b));
//     const userObjects = helper.initialUsers.map(u => new User(u));
//     const blogPromise = blogObjects.map(b => b.save());
//     const userPromise = userObjects.map(u => u.save());
//     const promiseArray = [...blogPromise, ...userPromise];
//     await Promise.all(promiseArray);
// });

// test('blogs are returned as json', async () => {
//     await api.get('/api/blogs')
//         .expect(200)
//         .expect('Content-Type', /application\/json/);
// });

// test('blogs have 2 instances', async () => {
//     const response = await api.get('/api/blogs');

//     expect(response.body).toHaveLength(helper.initialBlogs.length);
// });

// test('the first note is about HTTP methods', async () => {
//     const response = await api.get('/api/blogs');
//     const author = response.body.map(r => r.author);

//     expect(author).toContain('Ricky');
// });

// test.only('a valid blog can be added', async () => {
//     const users = await helper.usersInDb();
//     const user = users[0];

//     const newBlog = {
//         title: "Fullstack Dev 66556",
//         author: "Ricky populat",
//         url: "https://github.com/",
//         likes: 666,
//         userId: user.id
//     };

//     try {
//         await api
//             .post('/api/blogs')
//             .set('Authorization', 'abc123')
//             .send(newBlog)
//             .set('Accept', 'application/json')
//             .expect(201)
//             .expect('Content-Type', /application\/json/)
//     } catch (error) {
//         console.log(error);
//     }
//     // const response = await api.get('/api/blogs');
//     // const titles = response.body.map(r => r.title);

//     // expect(response.body).toHaveLength(helper.initialBlogs.length + 1);
//     // expect(titles).toContain('wonderful life');
// });

// test('a specific blog to view', async () => {
//     const blogs = await helper.blogsInDb();
//     const blogToView = blogs[0];

//     const resultBlog = await api
//         .get(`/api/blogs/${blogToView.id}`)
//         .expect(200)
//         .expect('Content-Type', /application\/json/);

//     expect(resultBlog.body).toEqual(blogToView);
// });

// test('can delete blog', async () => {
//     const blogsStart = await helper.blogsInDb();
//     const blogToDelete = blogsStart[0];

//     await api
//         .delete(`/api/blogs/${blogToDelete.id}`)
//         .expect(204);

//     const blogsEnd = await helper.blogsInDb();
//     expect(blogsEnd).toHaveLength(helper.initialBlogs.length - 1);

//     const authors = blogsEnd.map(b => b.author);
//     expect(authors).not.toContain(blogToDelete.author);
// });

// test('blog id is defined', async () => {
//     const blogsStart = await helper.blogsInDb();
//     const blogToView = blogsStart[0];

//     const resultBlog = await api
//         .get(`/api/blogs/${blogToView.id}`)
//         .expect(200)
//         .expect('Content-Type', /application\/json/);

//     expect(resultBlog.body.id).toBeDefined();
// });

// test('if likes property is missing, the default value is 0', async () => {
//     const newBlog = {
//         title: "wonderful life",
//         author: "ricky",
//         url: "www.happy.com",
//         likes: null
//     };

//     const response = await api
//         .post('/api/blogs')
//         .send(newBlog)
//         .set('Accept', 'application/json')
//         .expect(201)
//         .expect('Content-Type', /application\/json/);

//     expect(response.body.likes).toEqual(0);
// });

// test('status code is 400', async () => {
//     const newBlog = {
//         title: null,
//         author: "ricky",
//         url: null,
//         likes: 42
//     };

//     try {
//         var res = await api.post('/api/blogs').send(newBlog);
//     } catch (error) {
//         console.log(error);
//     }

//     expect(res.statusCode).toBe(400);
// });

// test('can update blog', async () => {
//     const blogsStart = await helper.blogsInDb();
//     const blogToBeUpdated = blogsStart[0];
//     const newBlog = {
//         title: "Null person",
//         author: "ricky",
//         url: "www.mytime.com",
//         likes: 42
//     };

//     try {
//         var res = await api.put(`/api/blogs/${blogToBeUpdated.id}`).send(newBlog);
//     } catch (error) {
//         console.log(error);
//     }

//     expect(res.statusCode).toBe(200);
// });

afterAll(() => {
    mongoose.connection.close();
});