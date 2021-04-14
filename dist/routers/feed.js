"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const { upload, bring, like, rank, remove, edit, cmtUpload, cmtLike, cmtRemove, cmtEdit, cmtBring, topicBring } = require('../controllers/feed');
const router = express_1.Router();
//? 피드 관련 라우터
router.post('/', upload);
router.post('/lookup', bring);
router.post('/like', like);
router.delete('/', remove);
router.patch('/', edit);
//? 랭크 관련 라우터
router.get('/rank', rank);
//? 코멘트 관련 라우터
router.post('/comment/lookup', cmtBring);
router.post('/comment', cmtUpload);
router.post('/comment/like', cmtLike);
router.delete('/comment', cmtRemove);
router.patch('/comment', cmtEdit);
//? 토픽
router.get('/topic', topicBring);
exports.default = router;
