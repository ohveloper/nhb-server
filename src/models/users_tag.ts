import {
  DataTypes, 
  Model, 
} from 'sequelize';
import { sequelize } from './index';
import { Users } from './user';
import { Tags } from './tag'

interface Users_tagsAttributes {
  id?: number,
  content: string,
  tagId: number,
  userId: number
};

export class Users_tags extends Model <Users_tagsAttributes> {
  public readonly id!: number;
  public content!: string;
  public tagId!: number;
  public userId!: number;

  public static associations: {
  };
};

Users_tags.init(
  {
    content: {
      type: DataTypes.STRING,
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
});

Tags.hasMany(Users_tags, {
  sourceKey: 'id',
  foreignKey: 'tagId'
})