import {
  DataTypes, 
  Model, 
} from 'sequelize';
import { sequelize } from './index';

interface TagsAttributes {
  id?: number,
  tagName: string,
  description: string | null
};

export class Tags extends Model <TagsAttributes> {
  public readonly id!: number;
  public tagName!: string;
  public description!: string;

  public static associations: {
  };
};

Tags.init(
  {
    tagName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    modelName: 'Tags',
    tableName: 'tags',
    sequelize,
    freezeTableName: true,
  }
)