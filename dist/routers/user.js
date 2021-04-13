"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const { bring, edit, withdrawal } = require('../controllers/user');
const router = express_1.Router();
router.post('/', bring);
router.patch('/', edit);
router.delete('/', withdrawal);
exports.default = router;
