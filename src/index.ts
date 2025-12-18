import express from 'express'
import bodyParser from "body-parser";
const app = express();

import userRouter from './routes/users';
import blogRouter from './routes/blogs';
import homeRouter from './routes/home';

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

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static('public'))

/** Router Block */
app.use('/',homeRouter)
app.use('/users', userRouter);
app.use('/blogs', blogRouter);

/** End Router Block */

app.listen(3000, () => console.log("Server ready on port 3000."));

module.exports = app;
