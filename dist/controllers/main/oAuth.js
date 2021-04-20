"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const oauth_1 = require("../../models/oauth");
const user_1 = require("../../models/user");
const oAuthHandler = async (req, res, next) => {
    const accessToken = req.headers.authorization;
    //? google oauth를 통해 정보를 받아온다
    if (!accessToken)
        return res.status(401).json({ message: 'unauthorized' });
    const oAuthData = await axios_1.default.get('https://www.googleapis.com/oauth2/v2/userinfo?access_token=' + accessToken, {
        headers: {
            authorization: `token ${accessToken}`,
            accept: 'application/json'
        }
    })
        .then(data => {
        return data.data;
    }).catch(e => console.log('oAuth token expired'));
    //? 받아온 정보의 email과 고유 id로 식별
    const { email, id } = oAuthData;
    const oAuthInfo = await oauth_1.OAuths.findOne({ where: { oAuthId: id }, raw: true });
    const userInfo = await user_1.Users.findOne({ where: { email }, raw: true });
    const issueToken = (secret, expiresIn, id, status) => {
        if (status === 9)
            return jsonwebtoken_1.default.sign({ id: id }, secret, { expiresIn: '3h' });
        else
            return jsonwebtoken_1.default.sign({ id: id }, secret, { expiresIn });
    };
    const accTokenSecret = process.env.ACCTOKEN_SECRET || 'acctest';
    const refTokenSecret = process.env.REFTOKEN_SECRET || 'reftest';
    const domain = process.env.COOKIE_DOMAIN || 'localhost';
    let issuedAccessToken, refreshToken, message = '';
    //? oauth id와 email로 된 user가 존재하지 않을 경우 회원가입
    if (!oAuthInfo && !userInfo) {
        const nickName = '시인' + Math.random().toString(36).slice(2);
        await user_1.Users.create({ email, nickName, introduction: null, avatarUrl: null, authCode: null, status: 1 }).then(async (d) => {
            await oauth_1.OAuths.create({ userId: d.id, oAuthId: id, platform: 'google' });
            issuedAccessToken = await issueToken(accTokenSecret, '5h', d.id);
            refreshToken = await issueToken(refTokenSecret, '14d', d.id);
            message = 'Sign up';
        });
    }
    ;
    const { status } = userInfo;
    //? email의 회원 정보만 존재할 경우 oauth랑 연동
    if (userInfo && !oAuthInfo) {
        await oauth_1.OAuths.create({ userId: userInfo.id, oAuthId: id, platform: 'google' });
        issuedAccessToken = await issueToken(accTokenSecret, '5h', userInfo.id, status);
        refreshToken = await issueToken(refTokenSecret, '14d', userInfo.id, status);
        message = 'Login';
    }
    //? 둘 다 존재할 경우 로그인
    if (userInfo && oAuthInfo) {
        const { userId } = oAuthInfo;
        if (userId !== userInfo.id)
            return res.status(401).json({ message: 'unauthorized' });
        issuedAccessToken = await issueToken(accTokenSecret, '5h', userId, status);
        refreshToken = await issueToken(refTokenSecret, '14d', userId, status);
        message = 'Login';
    }
    ;
    ;
    if (!issuedAccessToken)
        return console.log('token issue error');
    let resMessage = { data: { accessToken: issuedAccessToken }, message: message };
    if (Number(status) === 9) {
        resMessage = { data: { accessToken: accessToken, isAdmin: true }, message: "Admin accessed" };
    }
    res.status(200)
        .cookie('refreshToken', refreshToken, {
        domain,
        path: '/main',
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    })
        .json(resMessage);
};
exports.default = oAuthHandler;
