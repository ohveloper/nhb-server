"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const comment_1 = require("../../models/comment");
console.log("======Create Comments Table======");
const create_table_Comments = async () => {
    await comment_1.Comments.sync({ force: true })
        .then(() => {
        console.log("✅Success Create Comments Table");
    })
        .catch((err) => {
        console.log("❗️Error in Create Comments Table : ", err);
    });
};
create_table_Comments();
