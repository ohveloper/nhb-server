"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const topic_1 = __importDefault(require("./topic"));
const adminCheck_1 = __importDefault(require("./adminCheck"));
const tag_1 = __importDefault(require("./tag"));
const status_1 = __importDefault(require("./status"));
module.exports = {
    adminCheck: adminCheck_1.default,
    topicUpload: topic_1.default.upload,
    topicBring: topic_1.default.bring,
    topicEdit: topic_1.default.edit,
    tagUpload: tag_1.default.upload,
    tagBring: tag_1.default.bring,
    tagRemove: tag_1.default.remove,
    statusHandler: status_1.default
};
