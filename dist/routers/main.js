"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const { authEmail } = require('../controllers/main');
const router = express_1.Router();
router.get('/authEmail', authEmail);
exports.default = router;
