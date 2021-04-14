import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

//? 어드민 체크
const adminCheck = async (req: Request, res:Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({message: 'unauthorized'});
  const accessToken = authorization.split(' ')[1];
  const accTokenSecret = process.env.ACCTOKEN_SECRET || 'acctest';
  //? 어드민 status 9 체크
  const isAdmin: any = await jwt.verify(accessToken, accTokenSecret, async (err, decoded: any) => {
    if (err) return false
    return decoded.status === 9;
  });
  //? 어드민 아니라면 요청 거부
  if (!isAdmin) return res.status(401).json({message: 'rejected request'});
  else return next(); //? 맞다면 함수를 이용하여 다음 작업 실행.
}

export default adminCheck;