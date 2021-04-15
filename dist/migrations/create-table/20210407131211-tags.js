"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tag_1 = require("../../models/tag");
console.log("======Create Tags Table======");
const create_table_Tags = async () => {
    await tag_1.Tags.sync({ force: true })
        .then(() => {
        console.log("✅Success Create Tags Table");
    })
        .catch((err) => {
        console.log("❗️Error in Create Tags Table : ", err);
    });
};
create_table_Tags();
