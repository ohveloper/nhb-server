"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlackLists = void 0;
const sequelize_1 = require("sequelize");
const index_1 = require("./index");
;
class BlackLists extends sequelize_1.Model {
}
exports.BlackLists = BlackLists;
;
BlackLists.init({
    refreshToken: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    }
}, {
    modelName: 'BlackLists',
    tableName: 'blackLists',
    sequelize: index_1.sequelize,
    freezeTableName: true,
});
