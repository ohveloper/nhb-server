"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const avatar_1 = require("../../models/avatar");
console.log("======Create Avatars Table======");
const create_table_Avatars = async () => {
    await avatar_1.Avatars.sync({ force: true })
        .then(() => {
        console.log("✅Success Create Avatars Table");
    })
        .catch((err) => {
        console.log("❗️Error in Create Avatars Table : ", err);
    });
};
create_table_Avatars();
