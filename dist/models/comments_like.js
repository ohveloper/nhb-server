"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comments_likes = void 0;
const sequelize_1 = require("sequelize");
const index_1 = require("./index");
const user_1 = require("./user");
const comment_1 = require("./comment");
;
class Comments_likes extends sequelize_1.Model {
}
exports.Comments_likes = Comments_likes;
;
Comments_likes.init({
    commentId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    modelName: 'Comments_likes',
    tableName: 'comments_likes',
    sequelize: index_1.sequelize,
    freezeTableName: true,
});
user_1.Users.hasMany(Comments_likes, {
    sourceKey: "id",
    foreignKey: "userId",
    as: 'cmtLikesUserId'
});
Comments_likes.belongsTo(user_1.Users, {
    foreignKey: 'userId',
    as: 'cmtLikesUserId'
});
comment_1.Comments.hasMany(Comments_likes, {
    sourceKey: 'id',
    foreignKey: 'commentId',
    as: 'cmtLikesCommentId'
});
Comments_likes.belongsTo(comment_1.Comments, {
    foreignKey: 'commentId',
    as: 'cmtLikesCommentId'
});
