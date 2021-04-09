"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const feed_1 = __importDefault(require("./feed"));
const like_1 = __importDefault(require("./like"));
const rank_1 = __importDefault(require("./rank"));
const comment_1 = __importDefault(require("./comment"));
module.exports = {
    upload: feed_1.default.upload,
    bring: feed_1.default.bring,
    remove: feed_1.default.remove,
    edit: feed_1.default.edit,
    like: like_1.default,
    rank: rank_1.default,
    cmtUpload: comment_1.default.upload,
    cmtLike: comment_1.default.like,
    cmtRemove: comment_1.default.remove,
    cmtEdit: comment_1.default.edit,
    cmtBring: comment_1.default.bring
};
