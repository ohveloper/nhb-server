"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sequelize_1 = __importDefault(require("sequelize"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_1 = require("../../models/user");
const users_tag_1 = require("../../models/users_tag");
const tag_1 = require("../../models/tag");
const topic_1 = require("../../models/topic");
const like_1 = require("../../models/like");
const comment_1 = require("../../models/comment");
const feed_1 = require("../../models/feed");
dotenv_1.default.config();
const bringPrivateFeeds = async (req, res, next) => {
    const Op = sequelize_1.default.Op;
    const { authorization } = req.headers;
    const { limit, userId, feedId } = req.body;
    if (!authorization && !userId)
        return res.status(401).json({ message: 'unauthorized' });
    if (!limit)
        return res.status(400).json({ message: 'need accurate informaion' });
    const lastFeed = await feed_1.Feeds.max('id'); //? 새로고침 밑의 null 자리에 넣고 변수 하나로 줄여도 됨
    const preFeed = feedId ? await feed_1.Feeds.max('id', { where: { id: { [Op.lt]: feedId } } }).then(d => {
        if (!d)
            return -1;
        return d;
    }) : null; //? 계속탐색
    if (preFeed === -1)
        return res.status(200).json({ data: { userFeeds: [] }, message: 'ok' });
    //? 시작점 기준으로 조회 limit으로 조회 범위 설정
    const feedsFunc = async (userId) => {
        return await feed_1.Feeds.findAll({ order: [['id', 'DESC']], limit,
            where: { id: { [Op.lte]: preFeed || lastFeed } },
            include: [
                {
                    model: user_1.Users,
                    as: 'usersFeeds',
                    attributes: ['id', 'nickName'],
                    where: { id: userId },
                    include: [
                        {
                            model: users_tag_1.Users_tags,
                            as: 'userIdTag',
                            attributes: ['isUsed'],
                            include: [
                                {
                                    model: tag_1.Tags,
                                    as: 'tagIdTag',
                                    attributes: ['tagName']
                                }
                            ]
                        }
                    ]
                },
                {
                    model: topic_1.Topics,
                    as: 'topicsFeeds',
                    attributes: ['word']
                },
                {
                    model: like_1.Likes,
                    as: 'feedsLikes',
                    attributes: ['id']
                },
                {
                    model: comment_1.Comments,
                    as: 'commentsFeedId',
                    attributes: ['id']
                }
            ],
        }).catch(e => { console.log('get feeds error'); });
    };
    let feeds = [];
    //? userId가 있으면 토큰이 있어도 무시하게 하여 조회 가능하게 만들기
    //? 유저가 다른 유저를 찾아볼 때 사용
    if (authorization && !userId) {
        const accessToken = authorization.split(' ')[1];
        const accTokenSecret = process.env.ACCTOKEN_SECRET || 'acctest';
        await jsonwebtoken_1.default.verify(accessToken, accTokenSecret, async (err, decoded) => {
            if (err)
                return res.status(401).json({ message: 'invalid token' });
            feeds = await feedsFunc(decoded.id);
        });
    }
    else {
        feeds = await feedsFunc(userId);
    }
    if (!feeds)
        return res.status(200).json({ message: 'feeds do not exists' });
    const privateFeeds = [];
    for (let i = 0; i < feeds.length; i += 1) {
        ;
        const { id, content, createdAt, updatedAt, topicsFeeds, usersFeeds, feedsLikes, commentsFeedId } = feeds[i].get();
        let tag = null;
        if (usersFeeds.userIdtag) {
            tag = usersFeeds.userIdTag.filter((a) => a.isUsed === 1)[0].tagIdTag.tagName;
        }
        const feed = {
            feedId: id,
            user: { userId: usersFeeds.id, nickName: usersFeeds.nickName, tag },
            topic: topicsFeeds.word,
            content: JSON.parse(content),
            likes: feedsLikes.length,
            comments: commentsFeedId.length,
            updatedAt,
            createdAt
        };
        privateFeeds.push(feed);
    }
    ;
    res.status(200).json({ data: { privateFeeds }, message: 'ok' });
};
exports.default = bringPrivateFeeds;
