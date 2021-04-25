"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../config/config");
//? db와 연결할 시퀄라이즈 객체 생성
exports.sequelize = new sequelize_1.Sequelize(config_1.config.development.database, config_1.config.development.username, config_1.config.development.password, {
    host: config_1.config.development.host,
    dialect: 'mysql',
    timezone: '+09:00'
});
