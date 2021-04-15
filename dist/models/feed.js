"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Feeds = void 0;
const sequelize_1 = require("sequelize");
const index_1 = require("./index");
const user_1 = require("./user");
const topic_1 = require("./topic");
;
class Feeds extends sequelize_1.Model {
}
exports.Feeds = Feeds;
;
Feeds.init({
    likeNum: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    commentNum: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    content: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    topicId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    modelName: 'Feeds',
    tableName: 'feeds',
    sequelize: index_1.sequelize,
    freezeTableName: true,
});
user_1.Users.hasMany(Feeds, {
    sourceKey: "id",
    foreignKey: "userId",
    as: 'usersFeeds'
});
Feeds.belongsTo(user_1.Users, {
    foreignKey: 'userId',
    as: 'usersFeeds'
});
topic_1.Topics.hasMany(Feeds, {
    sourceKey: 'id',
    foreignKey: 'topicId',
    as: 'topicsFeeds'
});
Feeds.belongsTo(topic_1.Topics, {
    foreignKey: 'topicId',
    as: 'topicsFeeds'
});
