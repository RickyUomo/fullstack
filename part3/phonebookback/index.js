const express = require('express');

const app = express();
const logger = require('./utils/logger');
const config = require('./utils/config');
const phonebookRouter = require('./controllers/phonebook');
const middleware = require('./utils/middleware');

app.use(express.json());
app.use(express.static('build'));

app.use(middleware.morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        tokens.reqBody(req, res)
    ].join(' ');
}));

app.use('/api/persons', phonebookRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

app.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`);
});