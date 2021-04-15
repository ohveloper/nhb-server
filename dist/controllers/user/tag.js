"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tag_1 = require("../../models/tag");
const tag = async (req, res, next) => {
    const tags = await tag_1.Tags.findAll({ attributes: ['id', 'tagName', 'description', 'tagUrl'], raw: true });
    res.status(200).json({ data: { tags }, message: 'All tags info' });
};
exports.default = tag;
