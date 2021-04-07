import {
  DataTypes, 
  Model, 
} from 'sequelize';
import { sequelize } from './index';
import { Users } from './user';
import { Topics } from './topic';

interface FeedsAttributes {
  id?: number,
  content: string,
  topicId: number,
  userId: number
};

export class Feeds extends Model <FeedsAttributes> {
  public readonly id!: number;
  public content!: string;
  public topicId!: number;
  public userId!: number;

  public static associations: {
  };
};

Feeds.init(
  {
    content: {
      type: DataTypes.STRING,
      allowNull: false
    },
    topicId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  },
  {
    modelName: 'Feeds',
    tableName: 'feeds',
    sequelize,
    freezeTableName: true,
  }
)

Users.hasMany(Feeds, {
  sourceKey : "id",
  foreignKey : "userId",
});

Topics.hasMany(Feeds, {
  sourceKey: 'id',
  foreignKey: 'topicId'
})
