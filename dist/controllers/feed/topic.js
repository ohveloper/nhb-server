"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const topic_1 = require("../../models/topic");
const sequelize_1 = __importDefault(require("sequelize"));
//? 어드민이랑 같은 알고리즘
const topicBring = async (req, res, next) => {
    const Op = sequelize_1.default.Op;
    const standardDate = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().substr(0, 10);
    await topic_1.Topics.findAll({
        where: { expiration: { [Op.lte]: standardDate } },
        order: [['expiration', 'DESC']],
        attributes: ['id', 'word', 'expiration']
    }).then(d => {
        if (d.length === 0)
            return res.status(400).json({ message: 'there are no topics' });
        const topics = d.map(a => {
            a.expiration = new Date(new Date(a.expiration).setHours(new Date(a.expiration).getHours() + 9));
            return a;
        });
        res.status(200).send({ data: { topics }, message: 'ok' });
    });
};
exports.default = topicBring;
