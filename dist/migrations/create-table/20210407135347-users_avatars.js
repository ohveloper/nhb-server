"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const users_avatar_1 = require("../../models/users_avatar");
console.log("======Create Users_avatars Table======");
const create_table_Users_avatars = async () => {
    await users_avatar_1.Users_avatars.sync({ force: true })
        .then(() => {
        console.log("✅Success Create Users_avatars Table");
    })
        .catch((err) => {
        console.log("❗️Error in Create Users_avatars Table : ", err);
    });
};
create_table_Users_avatars();
