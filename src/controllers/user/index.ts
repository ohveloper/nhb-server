import userHandler from './user';
import liveRank from './liveRank';

module.exports = {
  bring: userHandler.bring,
  edit: userHandler.edit,
  withdrawal: userHandler.withdrawal,
  liveRank,
};