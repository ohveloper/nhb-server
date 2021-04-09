import feedHandler from './feed';
import likeHandler from './like';
import rank from './rank';
import commentHandler from './comment'

module.exports = {
  upload: feedHandler.upload,
  bring: feedHandler.bring,
  remove: feedHandler.remove,
  edit: feedHandler.edit,
  like: likeHandler,
  rank,
  cmtUpload: commentHandler.upload,
  cmtLike: commentHandler.like,
  cmtRemove: commentHandler.remove,
  cmtEdit: commentHandler.edit,
  cmtBring: commentHandler.bring
}