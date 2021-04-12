import userHandler from './user';
import bringPrivateFeeds from './feed';

module.exports = {
  bring: userHandler.bring,
  edit: userHandler.edit,
  withdrawal: userHandler.withdrawal,
  feeds: bringPrivateFeeds,
};