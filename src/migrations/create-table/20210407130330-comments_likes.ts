import { Comment_likes } from '../../models/comment_like';

console.log("======Create Comment_likes Table======");

const create_table_Comment_likes = async() => {
  await Comment_likes.sync({force: true})
  .then(() => {
    console.log("✅Success Create Comment_likes Table");
  })
  .catch((err) => {
    console.log("❗️Error in Create Comment_likes Table : ", err);
  })
};

create_table_Comment_likes();
