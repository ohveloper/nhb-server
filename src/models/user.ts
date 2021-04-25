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
// import { OAuths } from './oauth'; //? 관계를 정의할 모델 불러오기

interface UsersAttributes {
  id?: number;
  email : string;
  nickName : string;
  introduction: string | null;
  avatarUrl: string | null;
  authCode: string | null;
  status: number;
  usersLikes?: any;
  userIdTag?: any;
};

export class Users extends Model<UsersAttributes>{
  public readonly id! : number;   //굳이 안넣어줘도 될 것 같지만 공식문서에 있으니깐 일단 넣어줌.
  public email! : string;
  public nickName! : string;
  public introduction!: string;
  public avatarUrl!: string | null;
  public authCode!: string;
  public status!: number;

  // timestamps!
  public readonly createdAt!: Date;   //굳이 안넣어줘도 될 것 같지만 공식문서에 있으니깐 일단 넣어줌.
  public readonly updatedAt!: Date;   //굳이 안넣어줘도 될 것 같지만 공식문서에 있으니깐 일단 넣어줌.

//? 메소드 정의
  // public getScores!: HasManyGetAssociationsMixin<Scores>; // Note the null assertions!
  // public addScores!: HasManyAddAssociationMixin<Scores, number>;
  // public hasScores!: HasManyHasAssociationMixin<Scores, number>;
  // public countScores!: HasManyCountAssociationsMixin;
  // public createScores!: HasManyCreateAssociationMixin<Scores>;
//? association 정의 나중에 join을 할 때 as로써 구분하여 활용
  public static associations: {
    // usersoAuths:Association<Users, OAuth>
  };
}

//? 모델 생성
Users.init(
  {
      email : {
        type : DataTypes.STRING(45),
        allowNull: false
      },
      nickName : {
        type : DataTypes.STRING(45),
        allowNull : false
      },
      introduction: {
        type: DataTypes.STRING,
        allowNull: true
      },
      avatarUrl: {
        type: DataTypes.STRING,
        allowNull: true
      },
      authCode: {
        type: DataTypes.STRING,
        allowNull: true
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false
      }
  },
  {
      modelName : 'Users',
      tableName : 'users',
      sequelize,
      freezeTableName : true,
  }
)

//? 관계정의
// Users.hasMany(OAuths, {
//   sourceKey : "id",
//   foreignKey : "userId",
//   as: 위에서 정의한 association 이름
// });