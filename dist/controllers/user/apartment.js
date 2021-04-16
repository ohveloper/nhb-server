"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const feed_1 = require("../../models/feed");
const weekArray_1 = __importDefault(require("../func/weekArray"));
const apt = async (req, res, next) => {
    const { userId } = req.body;
    if (!userId)
        return res.status(400).json({ message: 'Need accurate informations' });
    const weekArr = weekArray_1.default.slice();
    const getFeeds = await feed_1.Feeds.findAll({ where: { userId }, attributes: ['createdAt'], raw: true }).then(d => {
        return d.map(feed => {
            let { createdAt } = feed;
            createdAt = new Date(createdAt.setHours(createdAt.getHours() + 9));
            return feed;
        });
    });
    for (let i = 0; i < getFeeds.length; i += 1) {
        for (let j = 0; j < weekArr.length; j += 1) {
            for (let k = 0; k < weekArr[j].length; k += 1) {
                if (getFeeds[i].createdAt.toISOString().substr(0, 10) === weekArr[j][k].date) {
                    weekArr[j][k].feedNum += 1;
                }
            }
        }
    }
    res.status(200).json({ data: { apartment: weekArr }, message: 'Ok' });
};
exports.default = apt;
