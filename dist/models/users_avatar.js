"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users_avatars = void 0;
const sequelize_1 = require("sequelize");
const index_1 = require("./index");
const user_1 = require("./user");
const avatar_1 = require("./avatar");
;
class Users_avatars extends sequelize_1.Model {
}
exports.Users_avatars = Users_avatars;
;
Users_avatars.init({
    avatarId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    modelName: 'Users_avatars',
    tableName: 'Users_avatars',
    sequelize: index_1.sequelize,
    freezeTableName: true,
});
user_1.Users.hasMany(Users_avatars, {
    sourceKey: "id",
    foreignKey: "userId",
});
avatar_1.Avatars.hasMany(Users_avatars, {
    sourceKey: 'id',
    foreignKey: 'avatarId'
});
