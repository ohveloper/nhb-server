import {
  Sequelize, 
  DataTypes, 
  Model, 
  Optional,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyHasAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  Association
} from 'sequelize';
import {sequelize} from './index';
import { Users } from './user'

interface OauthsAttributes {
  platform : string,
  oAuthId : number,
  userId : number
};

export class OAuths extends Model <OauthsAttributes> {
  public readonly id!: number;
  public platform!: string;
  public oAuthId!: number;
  public userId!: number;

  public static associations: {
  };
};

OAuths.init(
  {
    platform: {
      type: DataTypes.STRING,
      allowNull: false
    },
    oAuthId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  },
  {
    modelName: 'OAuths',
    tableName: 'oauths',
    sequelize,
    freezeTableName: true,
  }
)

Users.hasMany(OAuths, {
  sourceKey : "id",
  foreignKey : "userId",
});
