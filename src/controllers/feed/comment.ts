import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Comments } from '../../models/comment';
import { Comments_likes } from '../../models/comments_like';
import { Feeds } from '../../models/feed';
import { Users } from '../../models/user';

const commentHandler = {
  //? 코멘트 업로드
  upload: (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    const { feedId, comment } = req.body;
    if (!authorization) return res.status(401).json({message: 'Unauthorized'});
    if (!feedId || !comment) return res.status(400).json({message: 'Need accurate informaions'});

    const accessToken = authorization.split(' ')[1];
    const accTokenSecret = process.env.ACCTOKEN_SECRET || 'acctest';
    //? 유효성 검사 후 업로드
    jwt.verify(accessToken, accTokenSecret, async (err, decode: any) => {
      if (err) return res.status(401).json({message: 'Invalid token'});
      const userId = decode.id;
      await Comments.create({comment, feedId, userId})
      .then( async (d) => {
        await Comments.count({where: {feedId}}).then( async (d) => {
          await Feeds.update({commentNum: d}, {where: {id: feedId}}).then(d => {
            res.status(201).json({message: "The comment was uploaded"});
          });
        })
      })
      .catch(e => {
        console.log('comment upload error');
      })
    });
  },
  //? 코멘트 좋아요 기능 피드 좋아요 기능과 작동 방식 같음.
  like: (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    const { commentId } = req.body;
    if (!authorization) return res.status(401).json({message: 'Unauthorized'});
    if (!commentId) return res.status(400).json({message: 'Need accurate informaions'});

    const accessToken = authorization.split(' ')[1];
    const accTokenSecret = process.env.ACCTOKEN_SECRET || 'acctest';
    jwt.verify(accessToken, accTokenSecret, async (err, decoded: any) => {
      if (err) return res.status(401).json({message: 'Invalid token'});
      const userId = decoded.id;
      await Comments.findOne({where: {id: commentId}}).then((d:any) => {
        if (!d) return res.status(404).json({message: 'The comment does not exist'})
      });
      const isLike = await Comments_likes.findOne({where:{commentId, userId}}).then(d => {
        if (d) return true;
        else return false;
      });

      if (isLike) {
        await Comments_likes.destroy({where: {commentId, userId}}).then(d => {
          res.status(200).json({messasge: 'Comment dislike'});
        }).catch(d => console.log('comment dislike error'));
      } else {
        await Comments_likes.create({commentId, userId}).then(d => {
          res.status(201).json({message: 'Comment like'});
        }).catch(d => console.log('comment like error'));
      };
    });
  },

  //? 코멘트 삭제 방식은 피드 삭제 방식과 같음.
  remove: (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    const { commentId, feedId } = req.body;

    if (!authorization) return res.status(401).json({message: 'Unauthorized'});
    if (!commentId) return res.status(400).json({message: 'Need accurate informaions'});

    const accessToken = authorization.split(' ')[1];
    const accTokenSecret = process.env.ACCTOKEN_SECRET || 'acctest';
    jwt.verify(accessToken, accTokenSecret, async (err, decoded: any) => {
      if (err) return res.status(401).json({message: 'Invalid token'});

      const userId = decoded.id;

      let where: {id: number, userId?: number, feedId: number} = {id: commentId, userId, feedId};
      let message: string = `The comment ${commentId} was removed`
      if (decoded.status === 9) {
        where = {id: commentId, feedId};
        message = 'admin: ' + message;
      }
      await Comments.destroy({where}).then(async (d) => {
        if (d === 0) return res.status(404).json({message: 'The commentId does not match with userId'});
        await Comments.count({where: {feedId}}).then( async (d) => {
          await Feeds.update({commentNum: d}, {where: {id: feedId}}).then(d => {
            res.status(200).json({message});
          })
        });
      }).catch(e => console.log('remove comment error'));
    });
  },
  //? 코멘트 수정 피드 수정과 같은 방식
  edit: (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    const { comment, commentId } = req.body;

    if (!authorization) return res.status(401).json({message: 'Unauthorized'});
    if (!commentId || !comment) return res.status(400).json({message: 'Need accurate informaions'});
    
    const accessToken = authorization.split(' ')[1];
    const accTokenSecret = process.env.ACCTOKEN_SECRET || 'acctest';
    jwt.verify(accessToken, accTokenSecret, async (err, decoded: any) => {
      if (err) return res.status(401).json({message: 'Invalid token'});

      const userId = decoded.id;

      let where: {id: number, userId?: number} = {id: commentId, userId};
      let message: string = `The coment ${commentId} was edited`
      if (decoded.status === 9) {
        where = {id: commentId};
        message = 'admin: ' + message;
      }

      await Comments.update({comment}, {where})
      .then(d => {
        if(d[0] === 0) return res.status(404).json({message: 'The commentId does not match with userId'})
        res.status(200).json({message});
      })
      .catch(e => console.log('edit comment error'));
    });
  },

  //? 피드 아이디에 따른 코멘트 조회. 피드 조회와 같은 알고리즘
  bring: async (req: Request, res: Response, next: NextFunction) => {
    const { feedId } = req.body;
    if (!feedId) return res.status(400).json({message: 'Need accurate informaions'});
    const data: any = await Comments.findAll({
      where: {feedId},
      include: [
        {
          model: Comments_likes,
          as: 'cmtLikesCommentId'
        },
        {
          model: Users,
          as: 'commentsUserId'
        }
      ]
    }).catch(e => console.log('comment search error'));

    interface Cmt {
      user: {nickName: string, userId: number};
      commentId: number;
      comment: string | null;
      commentLike: number | null;
      createdAt: Date,
      updatedAt: Date
    }
    const comments: {}[] = [];
    for (let i = 0; i < data.length; i += 1) {
      const { id, comment, createdAt, updatedAt, cmtLikesCommentId, commentsUserId } = data[i].get();
      const newCreatedAt = new Date(new Date(createdAt).setHours(new Date(createdAt).getHours() + 9));
      const newUpdatedAt = new Date(new Date(updatedAt).setHours(new Date(updatedAt).getHours() + 9));
      const cmt: Cmt = {
        user: {nickName: commentsUserId.nickName, userId: commentsUserId.id},
        commentId: id,
        comment,
        commentLike: cmtLikesCommentId.length,
        createdAt: newCreatedAt,
        updatedAt: newUpdatedAt,
      };

      comments.push(cmt);
    };

    res.status(200).json({data: {comments}, message: `Feed ${feedId}\`s comment` });
  }
}

export default commentHandler;