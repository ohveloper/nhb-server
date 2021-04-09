import {
  Association,
  DataTypes, 
  Model, 
} from 'sequelize';
import { sequelize } from './index';
import { Users } from './user';
import { Tags } from './tag'

interface Users_tagsAttributes {
  id?: number,
  isUsed: number,
  tagId: number,
  userId: number
};

export class Users_tags extends Model <Users_tagsAttributes> {
  public readonly id!: number;
  public isUsed!: number;
  public tagId!: number;
  public userId!: number;

  public static associations: {
    userIdTag: Association<Users_tags, Users>;
    tagIdTag: Association<Users_tags, Tags>;
  };
};

Users_tags.init(
  {
    isUsed: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tagId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  },
  {
    modelName: 'Users_tags',
    tableName: 'users_tags',
    sequelize,
    freezeTableName: true,
  }
)

Users.hasMany(Users_tags, {
  sourceKey : "id",
  foreignKey : "userId",
  as: 'userIdTag'
});

Users_tags.belongsTo(Users, {
  foreignKey: 'userId',
  as: 'userIdTag'
});

Tags.hasMany(Users_tags, {
  sourceKey: 'id',
  foreignKey: 'tagId',
  as: 'tagIdTag'
});

Users_tags.belongsTo(Tags, {
  foreignKey: 'tagId',
  as: 'tagIdTag'
});