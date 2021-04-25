import { Tags } from '../../models/tag';

console.log("======Create Tags Table======");

const create_table_Tags = async() => {
  await Tags.sync({force: true})
  .then(() => {
    console.log("✅Success Create Tags Table");
  })
  .catch((err) => {
    console.log("❗️Error in Create Tags Table : ", err);
  })
};

create_table_Tags();