import express, { Application } from 'express';
import https from 'https';
import fs from 'fs';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { sequelize } from './models'; //? models에서 sequelize 객체 임포트
import dotenv from 'dotenv';
dotenv.config();
import indexRouter from './routers/index';
import feedRouter from './routers/feed';
import mainRouter from './routers/main';
import userRouter from './routers/user';

const port: number = 5000;
const app: Application = express();
const clientAddr = process.env.CLIENT_ADDR || 'https://localhost:3000'

app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//? cors 배포 후 설정 테스트 !! 중요!
app.use(cors(
  {
    origin: [clientAddr],
    credentials: true,
    methods: ["GET", "POST", "OPTIONS", "DELETE", "PATCH"]
  }
));
app.use(cookieParser());

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
  ).listen(port, async () => {
    console.log('https server on ' + port);
    await sequelize.authenticate().then(async () => {
      console.log('connection success');
    })
    .catch(e => {
      console.log(e);
    }) //? db연결 확인 서버를 켤 때마다 확인
  });
} else {
  server = app.listen(port, async () => {
    console.log('http server on ' + port);
    await sequelize.authenticate().then(async () => {
      console.log('connection success');
    })
    .catch(e => {
      console.log(e);
    })
  });
};