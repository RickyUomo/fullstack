const morgan = require('morgan');
morgan.token('reqBody', (req) => JSON.stringify(req.body));

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
    if (error.name === 'CastError') return response.status(400).send({ error: 'malformatted id' });
    else if (error.name === 'ValidationError') return response.status(400).json({ error: error.message });
    else if (error.name === 'JsonWebTokenError') return response.status(401).json({ error: 'invalid token' });
    else if (error.name === 'TokenExpiredError') return response.status(401).json({ error: 'token expired' });

    next(error);
};

const middleware = { morgan, unknownEndpoint, errorHandler };

module.exports = middleware;