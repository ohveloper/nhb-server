import {
  DataTypes, 
  Model, 
} from 'sequelize';
import { sequelize } from './index';

interface TopicsAttributes {
  id?: number,
  word: string,
  expiration: Date | string,
};

export class Topics extends Model <TopicsAttributes> {
  public readonly id!: number;
  public word!: string;
  public expiration!: Date | string;

  public static associations: {
  };
};

Topics.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    word: {
      type: DataTypes.STRING,
      allowNull: false
    },
    expiration: {
      type: DataTypes.DATE,
      allowNull: false
    }
  },
  {
    modelName: 'Topics',
    tableName: 'topics',
    sequelize,
    freezeTableName: true,
  }
);