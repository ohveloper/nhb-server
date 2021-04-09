import {
  Association,
  DataTypes, 
  Model, 
} from 'sequelize';
import { sequelize } from './index';
import { Users } from './user';
import { Feeds } from './feed';

interface CommentsAttributes {
  id?: number;
  comment: string;
  feedId: number;
  userId: number;
  commentsFeedId?: any;
  commentsUserId?: any;
};

export class Comments extends Model <CommentsAttributes> {
  public readonly id!: number;
  public comment!: string;
  public feedId!: number;
  public userId!: number;

  public static associations: {
    commentsFeedId: Association<Feeds, Comments>;
    commentsUserId: Association<Users, Comments>;
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
  as: 'commentsUserId'
});

Comments.belongsTo(Users, {
  foreignKey: 'userId',
  as: 'commentsUserId'
});

Feeds.hasMany(Comments, {
  sourceKey: 'id',
  foreignKey: 'feedId',
  as: 'commentsFeedId'
});

Comments.belongsTo(Feeds, {
  foreignKey: 'feedId',
  as: 'commentsFeedId'
});