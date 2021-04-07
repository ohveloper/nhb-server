"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tags = void 0;
const sequelize_1 = require("sequelize");
const index_1 = require("./index");
;
class Tags extends sequelize_1.Model {
}
exports.Tags = Tags;
;
Tags.init({
    tagName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    }
}, {
    modelName: 'Tags',
    tableName: 'tags',
    sequelize: index_1.sequelize,
    freezeTableName: true,
});
