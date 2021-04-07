import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import { Users } from '../../models/user';

const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.cookies;
  //? 헤더 내 쿠키에 리프레시 토큰이 없을 때
  if (!refreshToken) {
    res.status(401).json({message: "unauthorized"});
  } else {
    //? 있을 때 디코딩
    const refTokenSecret = process.env.REFTOKEN_SECRET || 'reftest';
    await jwt.verify(refreshToken, refTokenSecret, async (err: any, decoded: any) => {
      //? 토큰이 만료 되었을 때
      if (err) {
        res.status(401).json({messsage: "invalid reftoken"});
      } else {
        //? 토큰이 만료되지 않았을 때 액세스 토큰 재발급
        const userInfo = await Users.findOne({where: {id: decoded.id}});
        if (!userInfo) {
          res.status(401).json({message: "refresh token expired"});
        } else {
          const accessToken = await jwt.sign({id: userInfo.id}, refTokenSecret, { expiresIn: '5h'});
          res.status(200).json({"data": {"accessToken": accessToken}, "message": "issued new accesstoken"});
        }
      }
    })
  }
}

export default refreshToken;