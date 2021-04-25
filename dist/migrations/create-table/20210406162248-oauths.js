"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const oauth_1 = require("../../models/oauth");
console.log("======Create OAuths Table======");
const create_table_OAuths = async () => {
    await oauth_1.OAuths.sync({ force: true })
        .then(() => {
        console.log("✅Success Create OAuths Table");
    })
        .catch((err) => {
        console.log("❗️Error in Create OAuths Table : ", err);
    });
};
create_table_OAuths();
