"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Avatars = void 0;
const sequelize_1 = require("sequelize");
const index_1 = require("./index");
;
class Avatars extends sequelize_1.Model {
}
exports.Avatars = Avatars;
;
Avatars.init({
    avatarUrl: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
}, {
    modelName: 'Avatars',
    tableName: 'avatars',
    sequelize: index_1.sequelize,
    freezeTableName: true,
});
