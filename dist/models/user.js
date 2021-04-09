"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
const sequelize_1 = require("sequelize");
const index_1 = require("./index");
;
class Users extends sequelize_1.Model {
}
exports.Users = Users;
//? 모델 생성
Users.init({
    email: {
        type: sequelize_1.DataTypes.STRING(45),
        allowNull: false
    },
    nickName: {
        type: sequelize_1.DataTypes.STRING(45),
        allowNull: false
    },
    introduction: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    authCode: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    }
}, {
    modelName: 'Users',
    tableName: 'users',
    sequelize: index_1.sequelize,
    freezeTableName: true,
});
//? 관계정의
// Users.hasMany(OAuths, {
//   sourceKey : "id",
//   foreignKey : "userId",
//   as: 위에서 정의한 association 이름
// });
