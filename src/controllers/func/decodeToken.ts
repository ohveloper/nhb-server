import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const decodeToken = async (req: Request, res: Response): Promise<any> => {
  const { authorization } = req.headers;
  if (!authorization) return { userId: null, message: 'unauthorized' };
  const accessToken = authorization.split(' ')[1];
  const accTokenSecret = process.env.ACCTOKEN_SECRET || 'acctest'; 
  return await jwt.verify(accessToken, accTokenSecret, (err, decoded: any) => {
    if (err) return { userId: null, message: 'invalid token' };
    else return { userId: decoded.id, message: null };
  })
}