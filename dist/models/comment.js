"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comments = void 0;
const sequelize_1 = require("sequelize");
const index_1 = require("./index");
const user_1 = require("./user");
const feed_1 = require("./feed");
;
class Comments extends sequelize_1.Model {
}
exports.Comments = Comments;
;
Comments.init({
    comment: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    feedId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    modelName: 'Comments',
    tableName: 'comments',
    sequelize: index_1.sequelize,
    freezeTableName: true,
});
user_1.Users.hasMany(Comments, {
    sourceKey: "id",
    foreignKey: "userId",
});
feed_1.Feeds.hasMany(Comments, {
    sourceKey: 'id',
    foreignKey: 'feedId'
});
