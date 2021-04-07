import {Sequelize} from 'sequelize';
import {config} from '../config/config'

//? db와 연결할 시퀄라이즈 객체 생성

export const sequelize = new Sequelize(
    config.development.database,
    config.development.username,
    config.development.password,
    {
        host: config.development.host,
        dialect: 'mysql',
        timezone: '+09:00'
    }
)