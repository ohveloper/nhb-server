import {
  DataTypes, 
  Model, 
} from 'sequelize';
import { sequelize } from './index';

interface TagsAttributes {
  id?: number;
  tagName: string;
  description: string | null;
  tagUrl: string | null;
};

export class Tags extends Model <TagsAttributes> {
  public readonly id!: number;
  public tagName!: string;
  public description!: string | null;
  public tagUrl!: string | null;

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
    },
    tagUrl: {
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