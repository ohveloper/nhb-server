"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const comment_like_1 = require("../../models/comment_like");
console.log("======Create Comment_likes Table======");
const create_table_Comment_likes = async () => {
    await comment_like_1.Comment_likes.sync({ force: true })
        .then(() => {
        console.log("✅Success Create Comment_likes Table");
    })
        .catch((err) => {
        console.log("❗️Error in Create Comment_likes Table : ", err);
    });
};
create_table_Comment_likes();
