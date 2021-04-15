import topicHandler from './topic';
import adminCheck from './adminCheck';
import tagHandler from './tag';
import statusHandler from './status';

module.exports = {
  adminCheck,
  topicUpload: topicHandler.upload,
  topicBring: topicHandler.bring,
  topicEdit: topicHandler.edit,
  tagUpload: tagHandler.upload,
  tagBring: tagHandler.bring,
  tagRemove: tagHandler.remove,
  statusHandler
};