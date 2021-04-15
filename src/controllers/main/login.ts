import { Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import { Users } from '../../models/user';

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { authCode } = req.body;
  const userInfo = await Users.findOne({where: {authCode}});
  //? authCode가 없다면 만료된 것이므로 다시 로그인 인증 진행
  if (!userInfo) {
    res.status(401).json({"message": "Expired authcode"});
  } else {
    //? 토큰 발급하는 함수
    const id = Number(userInfo.id);
    const status = Number(userInfo.getDataValue('status'));

    if (status === 3) return res.status(400).json({message: "Banned user"});

    const issueToken = (secret: string, expiresIn: string) => {
      if (status === 9) return jwt.sign({ id }, secret, { expiresIn: '3h' });
      else return jwt.sign({ id }, secret, { expiresIn });
    };

    //? 코드 초기화 -> 토큰 발급 후 전송
    await Users.update({ authCode: null }, {where: { id }}).then( data => {
       const accTokenSecret = process.env.ACCTOKEN_SECRET || 'acctest';
       const refTokenSecret = process.env.REFTOKEN_SECRET || 'reftest';
       const domain = process.env.CLIENT_DOMAIN || 'localhost';
       const accessToken = issueToken(accTokenSecret, '5h');
       const refreshToken = issueToken(refTokenSecret, '15d');
       interface ResMessage {
         data: {accessToken: string, isAdmin?: boolean};
         message: string
       }
       let resMessage: ResMessage = {data: {accessToken: accessToken}, message: "Login"}; 
       if (status === 9) {
         resMessage = {data: {accessToken: accessToken, isAdmin: true}, message: "Admin accessed"};
       }
    
       res.status(200)
       .cookie('refreshToken', refreshToken, {
         domain,
         path: '/',
         httpOnly: true,
         secure: true,
         sameSite: 'none'
       })
       .json(resMessage)
      }
    );
  }
}

export default login;