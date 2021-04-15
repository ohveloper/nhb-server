"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const decodeToken = async (req, res) => {
    const { authorization } = req.headers;
    if (!authorization)
        return { userId: null, message: 'Unauthorized' };
    const accessToken = authorization.split(' ')[1];
    const accTokenSecret = process.env.ACCTOKEN_SECRET || 'acctest';
    return await jsonwebtoken_1.default.verify(accessToken, accTokenSecret, (err, decoded) => {
        if (err)
            return { userId: null, message: 'Invalid token' };
        else
            return { userId: decoded.id, message: null };
    });
};
exports.decodeToken = decodeToken;
