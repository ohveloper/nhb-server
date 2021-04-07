import { OAuths } from '../../models/oauth';

console.log("======Create OAuths Table======");

const create_table_oauths = async() => {
  await OAuths.sync({force: true})
  .then(() => {
    console.log("✅Success Create OAuths Table");
  })
  .catch((err) => {
    console.log("❗️Error in Create OAuths Table : ", err);
  })
};

create_table_oauths();