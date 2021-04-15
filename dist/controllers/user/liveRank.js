"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("sequelize"));
const feed_1 = require("../../models/feed");
const like_1 = require("../../models/like");
const tag_1 = require("../../models/tag");
const user_1 = require("../../models/user");
const users_tag_1 = require("../../models/users_tag");
const liveRank = async (req, res, next) => {
    const Op = sequelize_1.default.Op;
    const now = new Date();
    //? 15분전 시간 구하기
    const searchDate = new Date(now.setMinutes(now.getMinutes() - 15));
    //? 15 분 동안의 모든 Like 정보 수집
    const temp = await like_1.Likes.findAll({ where: { createdAt: { [Op.gte]: searchDate } }, include: [
            {
                model: feed_1.Feeds,
                as: 'feedsLikes',
                attributes: [[sequelize_1.default.fn('COUNT', 'id'), 'likeCount']],
                include: [
                    {
                        model: user_1.Users,
                        as: 'usersFeeds',
                        attributes: ['id', 'nickName'],
                    }
                ]
            }
        ], attributes: ['feedId'], group: ['feedId'], order: [[sequelize_1.default.literal("`feedsLikes.likeCount`"), 'DESC']] });
    //? 정보가 부족할 때 응답
    if (temp.length < 3)
        return res.status(400).json({ message: 'Not enough data' });
    //? 만약 정보가 있다면 아래처럼 정리하여 전송
    const rankTemp = {};
    for (let i = 0; i < temp.length; i += 1) {
        const userId = temp[i].feedsLikes.usersFeeds.id;
        const likeNum = Number(temp[i].feedsLikes.get().likeCount);
        if (!rankTemp[userId]) {
            rankTemp[userId] = likeNum;
        }
        else {
            rankTemp[userId] += likeNum;
        }
        ;
    }
    ;
    const rankArr = [];
    for (let key in rankTemp) {
        rankArr.push([key, rankTemp[key]]);
    }
    ;
    rankArr.sort((a, b) => b[1] - a[1]);
    const newRankArr = rankArr.slice(0, 3);
    if (newRankArr.length !== 3)
        return res.status(400).json({ message: 'not enough data' });
    const userRank = await user_1.Users.findAll({ where: { id: { [Op.or]: [newRankArr[0][0], newRankArr[1][0], newRankArr[2][0]] } }, include: [
            {
                model: users_tag_1.Users_tags,
                as: 'userIdTag',
                attributes: ['isUsed'],
                include: [
                    {
                        model: tag_1.Tags,
                        as: 'tagIdTag',
                        attributes: ['id', 'tagName']
                    }
                ]
            }
        ], attributes: ['id', 'nickName', 'avatarUrl'] });
    const liveRank = [];
    for (let i = 0; i < userRank.length; i += 1) {
        const { id, nickName, avatarUrl, userIdTag } = userRank[i];
        let tag = null;
        if (userIdTag) {
            for (let i = 0; i < userIdTag.length; i += 1) {
                if (userIdTag.isUsed === 1) {
                    tag = userIdTag.tagIdTag.tagId;
                    break;
                }
            }
        }
        ;
        const user = { userId: id, nickName, avatarUrl, tag, likeNum: rankTemp[id] };
        liveRank.push(user);
    }
    ;
    liveRank.sort((a, b) => b.likeNum - a.likeNum);
    res.status(200).json({ data: { liveRank }, message: 'Ok' });
};
exports.default = liveRank;
