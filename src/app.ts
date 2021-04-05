import express, {Request, Response, NextFunction, Application} from 'express';
import https from 'https';
import fs from 'fs'

const port: number = 5000;
const app: Application = express();

app.get('/', (req: Request, res: Response, next: NextFunction): void => {
  res.send('Hello, world');
});

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