import topicHandler from './topic';
import adminCheck from './adminCheck'

module.exports = {
  adminCheck,
  topicUpload: topicHandler.upload,
  topicBring: topicHandler.bring,
  topicEdit: topicHandler.edit,
};