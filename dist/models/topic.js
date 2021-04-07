"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Topics = void 0;
const sequelize_1 = require("sequelize");
const index_1 = require("./index");
;
class Topics extends sequelize_1.Model {
}
exports.Topics = Topics;
;
Topics.init({
    word: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
}, {
    modelName: 'Topics',
    tableName: 'topics',
    sequelize: index_1.sequelize,
    freezeTableName: true,
});
