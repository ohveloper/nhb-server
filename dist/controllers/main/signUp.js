"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const user_1 = require("../../models/user");
const signUp = async (req, res, next) => {
    const { authCode } = req.body;
    const userInfo = await user_1.Users.findOne({ where: { authCode } });
    //? authCode가 없다면 만료된 것이므로 다시 회원가입 인증 진행
    if (!userInfo) {
        res.status(404).json({ "message": "expired authCode" });
    }
    else {
        //? 만약 있다면
        const email = String(userInfo.getDataValue('email'));
        const nickName = String(userInfo.getDataValue('nickName'));
        const id = Number(userInfo.id);
        //? 토큰 발급하는 함수
        const issueToken = (secret, expiresIn) => {
            return jsonwebtoken_1.default.sign({ id }, secret, { expiresIn });
        };
        //? 코드가 일치하는 데이터 베이스의 스테이터스 코드 1(회원) 으로 바꾸고 코드 초기화 후
        //? 토큰 발급 후 전송
        await user_1.Users.update({ authCode: null, status: 1 }, { where: { id } }).then(async (data) => {
            const accTokenSecret = process.env.ACCTOKEN_SECRET || 'acctest';
            const refTokenSecret = process.env.REFTOKEN_SECRET || 'reftest';
            const domain = process.env.CLIENT_DOMAIN || 'localhost';
            const accessToken = issueToken(accTokenSecret, '5h');
            const refreshToken = issueToken(refTokenSecret, '15d');
            res.status(200)
                .cookie('refreshToken', refreshToken, {
                domain,
                path: '/',
                httpOnly: true,
                secure: true,
                sameSite: 'none'
            })
                .json({
                "data": {
                    "accessToken": accessToken,
                    "email": email,
                    "nickName": nickName
                },
                "message": "sign up successfully"
            });
        });
    }
    ;
};
exports.default = signUp;
