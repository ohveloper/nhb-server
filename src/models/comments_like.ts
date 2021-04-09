import {
  Association,
  DataTypes, 
  Model, 
} from 'sequelize';
import { sequelize } from './index';
import { Users } from './user';
import { Comments } from './comment';

interface Comments_likesAttributes {
  id?: number,
  commentId: number,
  userId: number,
  cmtLikesUserId?: Users | Comments_likes,
  cmtLikesCommentId?: Comment | Comments_likes,
};

export class Comments_likes extends Model <Comments_likesAttributes> {
  public readonly id!: number;
  public content!: string;
  public commentId!: number;
  public userId!: number;

  public static associations: {
    cmtLikesUserId: Association<Users, Comments_likes>
    cmtLikesCommentId: Association<Comments, Comments_likes>
  };
};

Comments_likes.init(
  {
    commentId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  },
  {
    modelName: 'Comments_likes',
    tableName: 'comments_likes',
    sequelize,
    freezeTableName: true,
  }
)

Users.hasMany(Comments_likes, {
  sourceKey : "id",
  foreignKey : "userId",
  as: 'cmtLikesUserId'
});

Comments_likes.belongsTo(Users, {
  foreignKey: 'userId',
  as: 'cmtLikesUserId'
});

Comments.hasMany(Comments_likes, {
  sourceKey: 'id',
  foreignKey: 'commentId',
  as: 'cmtLikesCommentId'
});

Comments_likes.belongsTo(Comments, {
  foreignKey: 'commentId',
  as: 'cmtLikesCommentId'
})