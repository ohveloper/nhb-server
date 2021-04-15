"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const { topicUpload, topicBring, adminCheck, topicEdit, tagUpload, tagBring, tagRemove, statusHandler } = require('../controllers/admin');
const router = express_1.Router();
router.use('/', adminCheck); //? 전역으로 어드민 체크
//? 토픽 관련
router.post('/topic', topicUpload);
router.get('/topic', topicBring);
router.patch('/topic', topicEdit);
//? 태그 관련
router.post('/tag', tagUpload);
router.get('/tag', tagBring);
router.delete('/tag', tagRemove);
//? 권한 관련
router.patch('/status', statusHandler);
exports.default = router;
