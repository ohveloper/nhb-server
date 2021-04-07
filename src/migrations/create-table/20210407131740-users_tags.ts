import { Users_tags } from '../../models/users_tag';

console.log("======Create Users_tags Table======");

const create_table_Users_tags = async() => {
  await Users_tags.sync({force: true})
  .then(() => {
    console.log("✅Success Create Users_tags Table");
  })
  .catch((err) => {
    console.log("❗️Error in Create Users_tags Table : ", err);
  })
};

create_table_Users_tags();