"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Likes = void 0;
const sequelize_1 = require("sequelize");
const index_1 = require("./index");
const user_1 = require("./user");
const feed_1 = require("./feed");
;
class Likes extends sequelize_1.Model {
}
exports.Likes = Likes;
;
Likes.init({
    feedId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    modelName: 'Likes',
    tableName: 'likes',
    sequelize: index_1.sequelize,
    freezeTableName: true,
});
user_1.Users.hasMany(Likes, {
    sourceKey: "id",
    foreignKey: "userId",
    as: 'usersLikes',
});
Likes.belongsTo(user_1.Users, {
    as: 'usersLikes',
    foreignKey: 'userId'
});
feed_1.Feeds.hasMany(Likes, {
    sourceKey: 'id',
    foreignKey: 'feedId',
    as: 'feedsLikes',
});
Likes.belongsTo(feed_1.Feeds, {
    foreignKey: 'feedId',
    as: 'feedsLikes',
});
