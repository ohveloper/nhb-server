import { BlackLists } from "../models/blacklist";
import Sequelize from 'sequelize'
//? 인터벌을 이용해 하루에 한번 정리를 해준다.
const blackListsHandler = () => {
  console.log('start blacklist handler');
  setInterval(() => {
    const Op = Sequelize.Op;
    const now = new Date();
    const date = new Date(now.setDate(now.getDate() - 15));
    BlackLists.destroy({where: {createdAt: {[Op.lt]: date}}}).then(d => {
        console.log(`${d} ref token removed`);
      }
    )
  }, 24 * 60 * 60 * 1000);
}
export default blackListsHandler;