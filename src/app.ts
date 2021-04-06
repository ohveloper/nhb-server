import express, { Application } from 'express';
import https from 'https';
import fs from 'fs';
import morgan from 'morgan'
import indexRouter from './routers/index';
import feedRouter from './routers/feed';
import mainRouter from './routers/main';
import userRouter from './routers/user'

const port: number = 5000;
const app: Application = express();

app.use(morgan('dev'));
app.use('/', indexRouter);
app.use('/feed', feedRouter);
app.use('/user', userRouter);
app.use('/main', mainRouter);

let server;

if (fs.existsSync('./key.pem') && fs.existsSync('./cert.pem')) {
  server = https.createServer(
    {
      key: fs.readFileSync('./key.pem', 'utf-8'),
      cert: fs.readFileSync ('./cert.pem', 'utf-8')
    },
    app
  ).listen(port, () => {console.log('https server on ' + port)});
} else {
  server = app.listen(port, () => {
    console.log('http server on ' + port);
  });
};