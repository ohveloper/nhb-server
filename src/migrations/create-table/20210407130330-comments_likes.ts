import { Comments_likes } from '../../models/comments_like';

console.log("======Create Comments_likes Table======");

const create_table_Comments_likes = async() => {
  await Comments_likes.sync({force: true})
  .then(() => {
    console.log("✅Success Create Comments_likes Table");
  })
  .catch((err) => {
    console.log("❗️Error in Create Comments_likes Table : ", err);
  })
};

create_table_Comments_likes();
