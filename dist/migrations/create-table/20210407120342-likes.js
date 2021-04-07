"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const like_1 = require("../../models/like");
console.log("======Create Likes Table======");
const create_table_Likes = async () => {
    await like_1.Likes.sync({ force: true })
        .then(() => {
        console.log("✅Success Create Likes Table");
    })
        .catch((err) => {
        console.log("❗️Error in Create Likes Table : ", err);
    });
};
create_table_Likes();
