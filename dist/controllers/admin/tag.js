"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tag_1 = require("../../models/tag");
const tagHandler = {
    upload: async (req, res, next) => {
        const { tagName, description } = req.body;
        if (!tagName || !description)
            return res.status(400).json({ message: 'Need accurate informations' });
        await tag_1.Tags.create({ tagName, description }).then(d => {
            res.status(201).json({ message: 'New tag is updated' });
        });
    },
    bring: async (req, res, next) => {
        await tag_1.Tags.findAll({ attributes: ['id', 'tagName', 'description'] }).then(d => {
            res.status(200).json({ data: { tags: d }, message: "All tags" });
        });
    },
    remove: async (req, res, next) => {
        const { tagId } = req.body;
        if (!tagId)
            return res.status(400).json({ message: 'Need accurate informations' });
        await tag_1.Tags.destroy({ where: { id: tagId } }).then(d => {
            res.status(200).json({ messgae: `Tag ${tagId} is removed` });
        });
    }
};
exports.default = tagHandler;
