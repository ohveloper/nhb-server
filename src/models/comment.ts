import {
  DataTypes, 
  Model, 
} from 'sequelize';
import { sequelize } from './index';
import { Users } from './user';
import { Feeds } from './feed';
import { Topics } from './topic';

interface CommentsAttributes {
  id?: number,
  comment: string,
  feedId: number,
  userId: number
};

export class Comments extends Model <CommentsAttributes> {
  public readonly id!: number;
  public comment!: string;
  public feedId!: number;
  public userId!: number;

  public static associations: {
  };
};

Comments.init(
  {
    comment: {
      type: DataTypes.STRING,
      allowNull: false
    },
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
    modelName: 'Comments',
    tableName: 'comments',
    sequelize,
    freezeTableName: true,
  }
)

Users.hasMany(Comments, {
  sourceKey : "id",
  foreignKey : "userId",
});

Feeds.hasMany(Comments, {
  sourceKey: 'id',
  foreignKey: 'feedId'
});