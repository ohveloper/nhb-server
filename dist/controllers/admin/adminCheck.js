"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
//? 어드민 체크
const adminCheck = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization)
        return res.status(401).json({ message: 'unauthorized' });
    const accessToken = authorization.split(' ')[1];
    const accTokenSecret = process.env.ACCTOKEN_SECRET || 'acctest';
    //? 어드민 status 9 체크
    const isAdmin = await jsonwebtoken_1.default.verify(accessToken, accTokenSecret, async (err, decoded) => {
        if (err)
            return false;
        return decoded.status === 9;
    });
    //? 어드민 아니라면 요청 거부
    if (!isAdmin)
        return res.status(401).json({ message: 'rejected request' });
    else
        return next(); //? 맞다면 함수를 이용하여 다음 작업 실행.
};
exports.default = adminCheck;
