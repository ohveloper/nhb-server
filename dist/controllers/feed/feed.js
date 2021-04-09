"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const sequelize_1 = __importDefault(require("sequelize"));
dotenv_1.default.config();
const topic_1 = require("../../models/topic");
const feed_1 = require("../../models/feed");
const user_1 = require("../../models/user");
const like_1 = require("../../models/like");
const comment_1 = require("../../models/comment");
const users_tag_1 = require("../../models/users_tag");
const tag_1 = require("../../models/tag");
const feedHandler = {
    //? 피드 업로드 핸들러
    upload: (req, res, next) => {
        const { authorization } = req.headers; //? 토큰 확인
        if (!authorization) {
            res.status(401).json({ message: 'unauthorized' }); //? 없다면 에러
        }
        else {
            const accessToken = authorization.split(' ')[1];
            const accTokenSecret = process.env.ACCTOKEN_SECRET || 'acctest';
            jsonwebtoken_1.default.verify(accessToken, accTokenSecret, async (err, decoded) => {
                if (err) {
                    res.status(401).json({ message: 'invalid acctoken' }); //? 토큰 만료
                }
                else {
                    //? 있다면 유저아이디를 이용, 바디에 담긴 콘텐트를 갖고와서 데이터베이스에 삽입
                    const { word, content } = req.body;
                    if (!word || content instanceof Array === false) {
                        return res.status(400).json({ message: 'need accurate informaion' });
                    }
                    const strContent = JSON.stringify(content);
                    const userId = decoded.id;
                    const topic = await topic_1.Topics.findOne({ where: { word } });
                    if (!topic) {
                        res.status(404).json({ message: 'topic not fonud' });
                    }
                    else {
                        const topicId = topic.getDataValue('id');
                        await feed_1.Feeds.create({ content: strContent, topicId, userId }).then(d => {
                            res.status(201).json({ message: 'uploaded' });
                        });
                    }
                }
            });
        }
    },
    //? 피드 가저오기
    bring: async (req, res, next) => {
        const Op = sequelize_1.default.Op; //? 시퀄라이즈 오퍼레이터
        const { feedId, limit } = req.body;
        //? 유효성 체크
        if (!limit)
            return res.status(400).json({ message: 'need accurate informaion' });
        //? 조회 시작 점 설정
        const lastFeed = await feed_1.Feeds.max('id'); //? 새로고침 밑의 null 자리에 넣고 변수 하나로 줄여도 됨
        const preFeed = feedId ? await feed_1.Feeds.max('id', { where: { id: { [Op.lt]: feedId } } }) : null; //? 계속탐색
        //? 시작점 기준으로 조회 limit으로 조회 범위 설정
        const feeds = await feed_1.Feeds.findAll({ order: [['id', 'DESC']], limit,
            where: { id: { [Op.lte]: preFeed || lastFeed } },
            include: [
                {
                    model: user_1.Users,
                    as: 'usersFeeds',
                    attributes: ['id', 'nickName'],
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
        //? 형식대로 피드 한곳에 모으기
        const userFeeds = [];
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
                content,
                likes: feedsLikes.length,
                comments: commentsFeedId.length,
                updatedAt,
                createdAt
            };
            userFeeds.push(feed);
        }
        ;
        res.status(200).json({ data: userFeeds, message: 'ok' });
    },
    //? 피드 삭제 핸들러
    remove: async (req, res, next) => {
        const { authorization } = req.headers;
        const { feedId } = req.body;
        if (!authorization) {
            return res.status(401).json({ message: 'unauthorized' });
        }
        ;
        if (!feedId) {
            return res.status(400).json({ message: 'need accurate informaion' });
        }
        ;
        const accessToken = authorization.split(' ')[1];
        const accTokenSecret = process.env.ACCTOKEN_SECRET || 'acctest';
        jsonwebtoken_1.default.verify(accessToken, accTokenSecret, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'invalid token' });
            }
            ;
            const userId = decoded.id;
            //? 모든 유효성 검사를 통과 후 삭제
            await feed_1.Feeds.destroy({ where: { id: feedId, userId } }).then(d => {
                if (d === 0)
                    return res.status(404).json({ message: 'feedId does not match with userId' });
                res.status(200).json({ message: `feed ${feedId} was removed` });
            })
                .catch(e => {
                console.log('delete feed error');
            });
        });
    },
    //? 피드 에디트
    edit: async (req, res, next) => {
        const { authorization } = req.headers;
        const { content, feedId } = req.body;
        if (!authorization) {
            return res.status(401).json({ message: 'unauthorized' });
        }
        ;
        if (!content || !feedId || content instanceof Array === false) {
            return res.status(400).json({ message: 'need accurate informaion' });
        }
        ;
        const accessToken = authorization.split(' ')[1];
        const accTokenSecret = process.env.ACCTOKEN_SECRET || 'acctest';
        jsonwebtoken_1.default.verify(accessToken, accTokenSecret, async (err, decoded) => {
            if (err)
                return res.status(401).json({ message: 'invalid token' });
            const userId = decoded.id;
            //? 모든 유효성 검사 후 수정.
            await feed_1.Feeds.update({ content: JSON.stringify(content) }, { where: { userId, id: feedId } }).then(d => {
                if (d[0] === 0)
                    return res.status(404).json({ message: 'feedId does not match with userId' });
                res.status(200).json({ message: `feed ${feedId} edited successfully` });
            }).catch(e => {
                console.log('edit feed error');
            });
        });
    }
};
exports.default = feedHandler;
