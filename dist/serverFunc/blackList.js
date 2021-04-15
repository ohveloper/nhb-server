"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const blacklist_1 = require("../models/blacklist");
const sequelize_1 = __importDefault(require("sequelize"));
//? 인터벌을 이용해 하루에 한번 정리를 해준다.
const blackListsHandler = () => {
    console.log('start blacklist handler');
    setInterval(() => {
        const Op = sequelize_1.default.Op;
        const now = new Date();
        const date = new Date(now.setDate(now.getDate() - 15));
        blacklist_1.BlackLists.destroy({ where: { createdAt: { [Op.lt]: date } } }).then(d => {
            console.log(`${d} ref token removed`);
        });
    }, 24 * 60 * 60 * 1000);
};
exports.default = blackListsHandler;
