const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/User');

loginRouter.post('/', async (request, response) => {
    const { username, password } = request.body;

    const user = await User.findOne({ username });
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash);

    if (!(passwordCorrect && user)) return response.status(401).json({ error: 'invalid username or password' });

    const userToken = {
        username: user.username,
        id: user._id,
    };

    const token = jwt.sign(userToken, process.env.SECRET, { expiresIn: 60 * 60 }); // create a new token

    response
        .send({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;