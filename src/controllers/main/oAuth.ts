import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import { OAuths } from '../../models/oauth';
import { Users } from '../../models/user';

const oAuthHandler = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.headers.authorization;
  //? google oauth를 통해 정보를 받아온다
  if (!accessToken) return res.status(401).json({message: 'unauthorized'});
  const oAuthData = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo?access_token=' + accessToken, { 
    headers: { 
      authorization: `token ${accessToken}`, 
      accept: 'application/json' 
    }})
    .then(data => {
      return data.data;
  }).catch(e => console.log('oAuth token expired'));

  //? 받아온 정보의 email과 고유 id로 식별
  const { email, id } = oAuthData;
  const oAuthInfo = await OAuths.findOne({where: {oAuthId: id}, raw: true});
  const userInfo: any = await Users.findOne({where: {email}, raw: true});
  
  const issueToken = (secret: string, expiresIn: string, id: number, status?: number | null) => {
      if (status === 9) return jwt.sign({ id: id }, secret, { expiresIn: '3h' });
      else return jwt.sign({ id: id }, secret, { expiresIn });
    };
  const accTokenSecret = process.env.ACCTOKEN_SECRET || 'acctest';
  const refTokenSecret = process.env.REFTOKEN_SECRET || 'reftest';
  const domain = process.env.COOKIE_DOMAIN || 'localhost';

  let issuedAccessToken, refreshToken, message: string = '';
  //? oauth id와 email로 된 user가 존재하지 않을 경우 회원가입
  if (!oAuthInfo && !userInfo) {
    const nickName:string = '시인' + Math.random().toString(36).slice(2);
    await Users.create({email, nickName, introduction: null, avatarUrl: null, authCode: null, status: 1}).then( async (d) => {
      await OAuths.create({userId: d.id, oAuthId:id, platform: 'google'});
      issuedAccessToken = await issueToken(accTokenSecret, '5h', d.id);
      refreshToken = await issueToken(refTokenSecret, '14d', d.id);
      message = 'Sign up';
    });
  };

  const { status } = userInfo;
  //? email의 회원 정보만 존재할 경우 oauth랑 연동
  if (userInfo && !oAuthInfo) {
    await OAuths.create({userId: userInfo.id, oAuthId: id, platform: 'google'});
    issuedAccessToken = await issueToken(accTokenSecret, '5h', userInfo.id, status);
    refreshToken = await issueToken(refTokenSecret, '14d', userInfo.id, status);
    message = 'Login';
  }
  
  //? 둘 다 존재할 경우 로그인
  if (userInfo && oAuthInfo) {
    const { userId } = oAuthInfo;
    if (userId !== userInfo.id) return res.status(401).json({message: 'unauthorized'});
    issuedAccessToken = await issueToken(accTokenSecret, '5h', userId, status);
    refreshToken = await issueToken(refTokenSecret, '14d', userId, status);
    message = 'Login';
  };

  interface ResMessage {
    data: {accessToken: string, isAdmin?: boolean};
    message: string
  };

  if (!issuedAccessToken) return console.log('token issue error');
  let resMessage: ResMessage = {data: {accessToken: issuedAccessToken}, message: message};
  if (Number(status) === 9) {
    resMessage = {data: {accessToken: accessToken, isAdmin: true}, message: "Admin accessed"};
  }

  res.status(200)
  .cookie('refreshToken', refreshToken, {
    domain,
    path: '/main',
    httpOnly: true,
    secure: true,
    sameSite: 'none'
  })
  .json(resMessage)
}

export default oAuthHandler;