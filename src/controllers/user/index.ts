import userHandler from './user';
import liveRank from './liveRank';
import userActHandler from './userActivity';
import tag from './tag';

module.exports = {
  bring: userHandler.bring,
  edit: userHandler.edit,
  withdrawal: userHandler.withdrawal,
  liveRank,
  like: userActHandler.like,
  comment: userActHandler.comment,
  cmtLike: userActHandler.cmtLike,
  tag
};