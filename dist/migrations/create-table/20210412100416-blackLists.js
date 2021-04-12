"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const blacklist_1 = require("../../models/blacklist");
console.log("======Create BlackLists Table======");
const create_table_BlackLists = async () => {
    await blacklist_1.BlackLists.sync({ force: true })
        .then(() => {
        console.log("✅Success Create BlackLists Table");
    })
        .catch((err) => {
        console.log("❗️Error in Create BlackLists Table : ", err);
    });
};
create_table_BlackLists();
