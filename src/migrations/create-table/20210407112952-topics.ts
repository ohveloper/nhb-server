import { Topics } from '../../models/topic';

console.log("======Create Topics Table======");

const create_table_Topics = async() => {
  await Topics.sync({force: true})
  .then(() => {
    console.log("✅Success Create Topics Table");
  })
  .catch((err) => {
    console.log("❗️Error in Create Topics Table : ", err);
  })
};

create_table_Topics();
