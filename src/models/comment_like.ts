import {
  DataTypes, 
  Model, 
} from 'sequelize';
import { sequelize } from './index';
import { Users } from './user';
import { Comments } from './comment';

interface Comment_likesAttributes {
  id?: number,
  commentId: number,
  userId: number
};

export class Comment_likes extends Model <Comment_likesAttributes> {
  public readonly id!: number;
  public content!: string;
  public commentId!: number;
  public userId!: number;

  public static associations: {
  };
};

Comment_likes.init(
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
    modelName: 'Comment_likes',
    tableName: 'comment_likes',
    sequelize,
    freezeTableName: true,
  }
)

Users.hasMany(Comment_likes, {
  sourceKey : "id",
  foreignKey : "userId",
});

Comments.hasMany(Comment_likes, {
  sourceKey: 'id',
  foreignKey: 'commentId',
});