import { Feeds } from '../../models/feed';

console.log("======Create Feeds Table======");

const create_table_Feeds = async() => {
  await Feeds.sync({force: true})
  .then(() => {
    console.log("✅Success Create Feeds Table");
  })
  .catch((err) => {
    console.log("❗️Error in Create Feeds Table : ", err);
  })
};

create_table_Feeds();
