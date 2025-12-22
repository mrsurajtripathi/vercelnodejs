import express from 'express'
import bodyParser from "body-parser";
const app = express();
import cors from 'cors';

import userRouter from './routes/users';
import blogRouter from './routes/blogs';
import homeRouter from './routes/home';
import authRouter from './routes/auth';
import examRouter from './routes/exam';
import student from './routes/student'

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
app.use(cors({
  origin: "*", // Allow all origins (change to specific domain for security)
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

const config:any={};
config.JWT_SECRET='SURSATOKEN$!4563YTSHSNNH(&hhTYnshsmxcngiwenmweuiwy';
(process as any).apps = {};
(process as any).apps = config;

/** Router Block */
app.use('/',authRouter);
app.use('/',homeRouter);
app.use('/users', userRouter);
app.use('/blogs', blogRouter);
app.use('/exams',examRouter);
app.use('/student',student);

/** End Router Block */

app.listen(3000, () => console.log("Server ready on port 3000."));

module.exports = app;
