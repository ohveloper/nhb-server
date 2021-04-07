import {
  DataTypes, 
  Model, 
} from 'sequelize';
import { sequelize } from './index';
import { Users } from './user';
import { Avatars } from './avatar';

interface Users_avatarsAttributes {
  id?: number,
  avatarId: number,
  userId: number
};

export class Users_avatars extends Model <Users_avatarsAttributes> {
  public readonly id!: number;
  public avatarId!: number;
  public userId!: number;

  public static associations: {
  };
};

Users_avatars.init(
  {
    avatarId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  },
  {
    modelName: 'Users_avatars',
    tableName: 'Users_avatars',
    sequelize,
    freezeTableName: true,
  }
)

Users.hasMany(Users_avatars, {
  sourceKey : "id",
  foreignKey : "userId",
});

Avatars.hasMany(Users_avatars, {
  sourceKey: 'id',
  foreignKey: 'avatarId'
})
