import {
  DataTypes, 
  Model, 
} from 'sequelize';
import { sequelize } from './index';

interface AvatarsAttributes {
  id?: number,
  avatarUrl: string,
};

export class Avatars extends Model <AvatarsAttributes> {
  public readonly id!: number;
  public avatarUrl!: string;

  public static associations: {
  };
};

Avatars.init(
  {
    avatarUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
  },
  {
    modelName: 'Avatars',
    tableName: 'avatars',
    sequelize,
    freezeTableName: true,
  }
)