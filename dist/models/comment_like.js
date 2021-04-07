"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment_likes = void 0;
const sequelize_1 = require("sequelize");
const index_1 = require("./index");
const user_1 = require("./user");
const comment_1 = require("./comment");
;
class Comment_likes extends sequelize_1.Model {
}
exports.Comment_likes = Comment_likes;
;
Comment_likes.init({
    commentId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    modelName: 'Comment_likes',
    tableName: 'comment_likes',
    sequelize: index_1.sequelize,
    freezeTableName: true,
});
user_1.Users.hasMany(Comment_likes, {
    sourceKey: "id",
    foreignKey: "userId",
});
comment_1.Comments.hasMany(Comment_likes, {
    sourceKey: 'id',
    foreignKey: 'commentId',
});
