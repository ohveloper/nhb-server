"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const feed_1 = require("../../models/feed");
console.log("======Create Feeds Table======");
const create_table_Feeds = async () => {
    await feed_1.Feeds.sync({ force: true })
        .then(() => {
        console.log("✅Success Create Feeds Table");
    })
        .catch((err) => {
        console.log("❗️Error in Create Feeds Table : ", err);
    });
};
create_table_Feeds();
