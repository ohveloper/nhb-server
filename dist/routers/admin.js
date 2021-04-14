"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const { topicUpload, topicBring, adminCheck, topicEdit } = require('../controllers/admin');
const router = express_1.Router();
router.use('/', adminCheck); //? 전역으로 어드민 체크
router.post('/topic', topicUpload);
router.get('/topic', topicBring);
router.patch('/topic', topicEdit);
exports.default = router;
