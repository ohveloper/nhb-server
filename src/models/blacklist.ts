import {
  Association,
  DataTypes, 
  Model, 
} from 'sequelize';
import { sequelize } from './index';

interface BlackListsAttributes {
  id?: number;
  refreshToken: string;
  createdAt?: Date;
};

export class BlackLists extends Model <BlackListsAttributes> {
  public readonly id!: number;
  public comment!: string;
  public feedId!: number;
  public userId!: number;

  public static associations: {
  };
};

BlackLists.init(
  {
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    modelName: 'BlackLists',
    tableName: 'blackLists',
    sequelize,
    freezeTableName: true,
  }
)