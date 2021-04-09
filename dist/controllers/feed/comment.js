"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const comment_1 = require("../../models/comment");
const comments_like_1 = require("../../models/comments_like");
const user_1 = require("../../models/user");
const commentHandler = {
    //? 코멘트 업로드
    upload: (req, res, next) => {
        const { authorization } = req.headers;
        const { feedId, comment } = req.body;
        if (!authorization)
            return res.status(401).json({ message: 'unauthorized' });
        if (!feedId || !comment)
            return res.status(400).json({ message: 'need accurate informaion' });
        const accessToken = authorization.split(' ')[1];
        const accTokenSecret = process.env.ACCTOKEN_SECRET || 'acctest';
        //? 유효성 검사 후 업로드
        jsonwebtoken_1.default.verify(accessToken, accTokenSecret, async (err, decode) => {
            if (err)
                return res.status(401).json({ message: 'invalid token' });
            const userId = decode.id;
            await comment_1.Comments.create({ comment, feedId, userId })
                .then(d => {
                res.status(201).json({ message: "posted comment successfully" });
            })
                .catch(e => {
                console.log('comment upload error');
            });
        });
    },
    //? 코멘트 좋아요 기능 피드 좋아요 기능과 작동 방식 같음.
    like: (req, res, next) => {
        const { authorization } = req.headers;
        const { commentId } = req.body;
        if (!authorization)
            return res.status(401).json({ message: 'unauthorized' });
        if (!commentId)
            return res.status(400).json({ message: 'need accurate informaion' });
        const accessToken = authorization.split(' ')[1];
        const accTokenSecret = process.env.ACCTOKEN_SECRET || 'acctest';
        jsonwebtoken_1.default.verify(accessToken, accTokenSecret, async (err, decoded) => {
            if (err)
                return res.status(401).json({ message: 'invalid token' });
            const userId = decoded.id;
            await comment_1.Comments.findOne({ where: { id: commentId } }).then((d) => {
                if (!d)
                    return res.status(404).json({ message: 'comment does not exist' });
            });
            const isLike = await comments_like_1.Comments_likes.findOne({ where: { commentId, userId } }).then(d => {
                if (d)
                    return true;
                else
                    return false;
            });
            if (isLike) {
                await comments_like_1.Comments_likes.destroy({ where: { commentId, userId } }).then(d => {
                    res.status(200).json({ messasge: 'comment dislike' });
                }).catch(d => console.log('comment dislike error'));
            }
            else {
                await comments_like_1.Comments_likes.create({ commentId, userId }).then(d => {
                    res.status(201).json({ message: 'comment like' });
                }).catch(d => console.log('comment like error'));
            }
            ;
        });
    },
    //? 코멘트 삭제 방식은 피드 삭제 방식과 같음.
    remove: (req, res, next) => {
        const { authorization } = req.headers;
        const { commentId } = req.body;
        if (!authorization)
            return res.status(401).json({ message: 'unauthorized' });
        if (!commentId)
            return res.status(400).json({ message: 'need accurate informaion' });
        const accessToken = authorization.split(' ')[1];
        const accTokenSecret = process.env.ACCTOKEN_SECRET || 'acctest';
        jsonwebtoken_1.default.verify(accessToken, accTokenSecret, async (err, decoded) => {
            if (err)
                return res.status(401).json({ message: 'invalid token' });
            const userId = decoded.id;
            await comment_1.Comments.destroy({ where: { id: commentId, userId } }).then(d => {
                if (d === 0)
                    return res.status(404).json({ message: 'commentId does not match with userId' });
                res.status(200).json({ message: `removed comment ${commentId} successfully` });
            }).catch(e => console.log('remove comment error'));
        });
    },
    //? 코멘트 수정 피드 수정과 같은 방식
    edit: (req, res, next) => {
        const { authorization } = req.headers;
        const { comment, commentId } = req.body;
        if (!authorization)
            return res.status(401).json({ message: 'unauthorized' });
        if (!commentId || !comment)
            return res.status(400).json({ message: 'need accurate informaion' });
        const accessToken = authorization.split(' ')[1];
        const accTokenSecret = process.env.ACCTOKEN_SECRET || 'acctest';
        jsonwebtoken_1.default.verify(accessToken, accTokenSecret, async (err, decoded) => {
            if (err)
                return res.status(401).json({ message: 'invalid token' });
            const userId = decoded.id;
            await comment_1.Comments.update({ comment }, { where: { id: commentId, userId } })
                .then(d => {
                if (d[0] === 0)
                    return res.status(404).json({ message: 'commentId does not match with userId' });
                res.status(200).json({ message: `edited coment ${commentId} succeessfully` });
            })
                .catch(e => console.log('edit comment error'));
        });
    },
    //? 피드 아이디에 따른 코멘트 조회. 피드 조회와 같은 알고리즘
    bring: async (req, res, next) => {
        const { feedId } = req.body;
        if (!feedId)
            return res.status(400).json({ message: 'need accurate informaion' });
        const data = await comment_1.Comments.findAll({
            where: { feedId },
            include: [
                {
                    model: comments_like_1.Comments_likes,
                    as: 'cmtLikesCommentId'
                },
                {
                    model: user_1.Users,
                    as: 'commentsUserId'
                }
            ]
        }).catch(e => console.log('comment search error'));
        const comments = [];
        for (let i = 0; i < data.length; i += 1) {
            const { id, comment, createdAt, updatedAt, cmtLikesCommentId, commentsUserId } = data[i].get();
            const cmt = {
                user: { nickName: commentsUserId.nickName, userId: commentsUserId.id },
                commentId: id,
                comment,
                commentLike: cmtLikesCommentId.length,
                createdAt,
                updatedAt,
            };
            comments.push(cmt);
        }
        ;
        res.status(200).json({ data: comments, message: 'ok' });
    }
};
exports.default = commentHandler;
