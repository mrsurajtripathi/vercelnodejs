import express from 'express'
var bodyParser = require('body-parser');

const app = express();


import userRouter from './routes/users';
import blogRouter from './routes/blogs';

import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';

process.on('uncaughtException', (err) => {
  console.log(err);
});

app.use(bodyParser.urlencoded({
  limit: '20mb',
  extended: true
}));
app.use(bodyParser.json({
  limit: '20mb'
}));

/** Router Block */
app.use('/users', userRouter);
app.use('/blogs', blogRouter);
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/** End Router Block */

app.listen(3000, () => console.log("Server ready on port 3000."));

module.exports = app;
