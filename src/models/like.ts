import {
  DataTypes, 
  Model, 
} from 'sequelize';
import {sequelize} from './index';
import { Users } from './user';
import { Feeds } from './feed'

interface LikesAttributes {
  id?: number,
  feedId: number,
  userId: number,
  createdAt?: Date,
  updatedAt?: Date
};

export class Likes extends Model <LikesAttributes> {
  public readonly id!: number;
  public feedId!: number;
  public userId!: number;

  public static associations: {
  };
};

Likes.init(
  {
    feedId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  },
  {
    modelName: 'Likes',
    tableName: 'likes',
    sequelize,
    freezeTableName: true,
  }
)

Users.hasMany(Likes, {
  sourceKey : "id",
  foreignKey : "userId",
});

Feeds.hasMany(Likes, {
  sourceKey: 'id',
  foreignKey: 'feedId'
});