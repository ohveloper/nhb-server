"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("./user"));
const feed_1 = __importDefault(require("./feed"));
module.exports = {
    bring: user_1.default.bring,
    edit: user_1.default.edit,
    withdrawal: user_1.default.withdrawal,
    feeds: feed_1.default,
};
