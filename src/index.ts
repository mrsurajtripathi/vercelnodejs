import path from 'path';
import express from 'express'
import bodyParser from "body-parser";
const app = express();
import { setupSwagger } from './swagger';


import userRouter from './routes/users';
import blogRouter from './routes/blogs';

process.on('uncaughtException', (err) => {
  console.log(err);
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/api-docs',express.static(path.join(__dirname, 'public/swagger-ui')))
setupSwagger(app);
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


/** End Router Block */

app.listen(3000, () => console.log("Server ready on port 3000."));

module.exports = app;
