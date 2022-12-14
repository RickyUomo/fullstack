const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/User');

usersRouter.get('/', async (request, response, next) => {
    try {
        const allUsers = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1 });
        response.json(allUsers);
    } catch (error) {
        next(error);
    }
});

usersRouter.get('/:id', async (request, response, next) => {
    const id = request.params.id;
    if (!id) throw Error('missing id');

    try {
        const user = await User.findById(id);
        response.json(user);
    } catch (error) {
        next(error);
    }
});

usersRouter.post('/', async (request, response, next) => {
    const { username, name, password } = request.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) return response.status(400).json({ error: 'username must be unique' });
    else if (username.length <= 3 || password.length <= 3) return response.status(400).json({ error: 'username or password must be longer than 3' });

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
        username,
        name,
        passwordHash
    });

    try {
        const savedUser = await user.save();
        response.status(201).json(savedUser);
    } catch (error) {
        next(error);
    }
});

module.exports = usersRouter;