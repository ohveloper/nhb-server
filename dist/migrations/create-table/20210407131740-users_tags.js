"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const users_tag_1 = require("../../models/users_tag");
console.log("======Create Users_tags Table======");
const create_table_Users_tags = async () => {
    await users_tag_1.Users_tags.sync({ force: true })
        .then(() => {
        console.log("✅Success Create Users_tags Table");
    })
        .catch((err) => {
        console.log("❗️Error in Create Users_tags Table : ", err);
    });
};
create_table_Users_tags();
