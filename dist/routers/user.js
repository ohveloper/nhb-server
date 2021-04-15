"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const { bring, edit, withdrawal, liveRank, like, comment, cmtLike, tag } = require('../controllers/user');
const router = express_1.Router();
router.post('/', bring);
router.patch('/', edit);
router.delete('/', withdrawal);
router.get('/', liveRank);
//? 유저 개인 활동 -> 좋아요 누른 게시물, 코멘트 남긴 게시물, 좋아요 누른 코멘트
router.get('/activity/like', like);
router.get('/activity/comment', comment);
router.get('/activity/cmtLike', cmtLike);
//? 모든 태그 내려주기
router.get('/tag', tag);
exports.default = router;
