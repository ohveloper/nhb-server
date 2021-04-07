import {Users} from '../../models/user';

console.log("======Create Users Table======");
//? model extends 의 sync 메소드는 자동으로 모델과 같은 구성의 테이블을 만들어준다.
const create_table_users = async() => {
    await Users.sync({force : true})
    .then(() => {
        console.log("✅Success Create User Table");
    })
    .catch((err) => {
        console.log("❗️Error in Create User Table : ", err);
    })
}

create_table_users();
