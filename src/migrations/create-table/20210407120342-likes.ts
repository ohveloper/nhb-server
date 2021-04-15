import { Likes } from '../../models/like';

console.log("======Create Likes Table======");

const create_table_Likes = async() => {
  await Likes.sync({force: true})
  .then(() => {
    console.log("✅Success Create Likes Table");
  })
  .catch((err) => {
    console.log("❗️Error in Create Likes Table : ", err);
  })
};

create_table_Likes();

