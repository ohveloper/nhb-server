"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const topic_1 = require("../../models/topic");
console.log("======Create Topics Table======");
const create_table_Topics = async () => {
    await topic_1.Topics.sync({ force: true })
        .then(() => {
        console.log("✅Success Create Topics Table");
    })
        .catch((err) => {
        console.log("❗️Error in Create Topics Table : ", err);
    });
};
create_table_Topics();
