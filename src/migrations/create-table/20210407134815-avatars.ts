import { Avatars } from '../../models/avatar';

console.log("======Create Avatars Table======");

const create_table_Avatars = async() => {
  await Avatars.sync({force: true})
  .then(() => {
    console.log("✅Success Create Avatars Table");
  })
  .catch((err) => {
    console.log("❗️Error in Create Avatars Table : ", err);
  })
};

create_table_Avatars();
