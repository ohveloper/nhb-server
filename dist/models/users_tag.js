"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users_tags = void 0;
const sequelize_1 = require("sequelize");
const index_1 = require("./index");
const user_1 = require("./user");
const tag_1 = require("./tag");
;
class Users_tags extends sequelize_1.Model {
}
exports.Users_tags = Users_tags;
;
Users_tags.init({
    isUsed: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    tagId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    modelName: 'Users_tags',
    tableName: 'users_tags',
    sequelize: index_1.sequelize,
    freezeTableName: true,
});
user_1.Users.hasMany(Users_tags, {
    sourceKey: "id",
    foreignKey: "userId",
    as: 'userIdTag'
});
Users_tags.belongsTo(user_1.Users, {
    foreignKey: 'userId',
    as: 'userIdTag'
});
tag_1.Tags.hasMany(Users_tags, {
    sourceKey: 'id',
    foreignKey: 'tagId',
    as: 'tagIdTag'
});
Users_tags.belongsTo(tag_1.Tags, {
    foreignKey: 'tagId',
    as: 'tagIdTag'
});
