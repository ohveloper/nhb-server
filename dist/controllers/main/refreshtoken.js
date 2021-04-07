"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const user_1 = require("../../models/user");
const refreshToken = async (req, res, next) => {
    const { refreshToken } = req.cookies;
    //? 헤더 내 쿠키에 리프레시 토큰이 없을 때
    if (!refreshToken) {
        res.status(401).json({ message: "unauthorized" });
    }
    else {
        //? 있을 때 디코딩
        const refTokenSecret = process.env.REFTOKEN_SECRET || 'reftest';
        await jsonwebtoken_1.default.verify(refreshToken, refTokenSecret, async (err, decoded) => {
            //? 토큰이 만료 되었을 때
            if (err) {
                res.status(401).json({ messsage: "invalid reftoken" });
            }
            else {
                //? 토큰이 만료되지 않았을 때 액세스 토큰 재발급
                const userInfo = await user_1.Users.findOne({ where: { id: decoded.id } });
                if (!userInfo) {
                    res.status(401).json({ message: "refresh token expired" });
                }
                else {
                    const accessToken = await jsonwebtoken_1.default.sign({ id: userInfo.id }, refTokenSecret, { expiresIn: '5h' });
                    res.status(200).json({ "data": { "accessToken": accessToken }, "message": "issued new accesstoken" });
                }
            }
        });
    }
};
exports.default = refreshToken;
