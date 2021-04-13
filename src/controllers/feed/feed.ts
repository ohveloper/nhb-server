import { Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Sequelize from 'sequelize'
dotenv.config();
import { Topics } from '../../models/topic';
import { Feeds } from '../../models/feed';
import { Users } from '../../models/user';
import { Users_tags } from '../../models/users_tag';
import { Tags } from '../../models/tag';

const feedHandler = {
  //? 피드 업로드 핸들러
  upload: (req:Request, res:Response, next:NextFunction) => {
    const { authorization } = req.headers; //? 토큰 확인
    if (!authorization) {
      res.status(401).json({message: 'unauthorized'}); //? 없다면 에러
    } else {
      const accessToken = authorization.split(' ')[1];
      const accTokenSecret = process.env.ACCTOKEN_SECRET || 'acctest';
      jwt.verify(accessToken, accTokenSecret, async (err, decoded: any) => {
        if (err) {
          res.status(401).json({message: 'invalid acctoken'}); //? 토큰 만료
        } else {
          //? 있다면 유저아이디를 이용, 바디에 담긴 콘텐트를 갖고와서 데이터베이스에 삽입
          const { word, content } = req.body;
          if (!word || content instanceof Array === false) {
            return res.status(400).json({message: 'need accurate informaion'});
          }
          const strContent = JSON.stringify(content);
          const userId = decoded.id;
          const topic = await Topics.findOne({where: { word }});
          if (!topic) {
            res.status(404).json({message: 'topic not fonud'});
          } else {
            const topicId = topic.getDataValue('id');
            await Feeds.create({ content: strContent, topicId, userId }).then(d => {
              res.status(201).json({message: 'uploaded'});
            });
          }
        }
      });
    }
  },

  //? 피드 가저오기
  bring: async (req: Request, res:Response, next:NextFunction) => {
    const Op = Sequelize.Op;

    const { topicId, isMaxLike, limit, userId, feedId } = req.body;
    if (!limit || !topicId) return res.status(400).json({message: 'need accurate informaion'});

    const startFeedId = feedId ? await Feeds.max('id', {where: {id: {[Op.lt]: feedId}}}).then(d => {
      if (!d) return -1;
      return d;
    }) : await Feeds.max('id'); //? 계속탐색
    
    if (startFeedId === - 1) return res.status(200).json({data: {userFeeds: []}, message: 'ok'});
    

    let where: any = {id: {[Op.lte]: startFeedId}, topicId};
    let order:any = [['id', 'DESC']];

    if (userId) {
      where['userId'] = userId;
    };

    if (isMaxLike) {
      order = [['likeNum', 'DESC']];
    };

    const temp: any = await Feeds.findAll({order: order, limit: limit, 
      where: where,
      include: [
        {
          model: Users, 
          as: 'usersFeeds',
          attributes: ['id', 'nickName'],
          include: [
            {
              model: Users_tags,
              as: 'userIdTag',
              attributes: ['isUsed'],
              include: [
                {
                  model: Tags,
                  as: 'tagIdTag',
                  attributes: ['id']
                }
              ]
            }
          ]
        },
        {
          model: Topics, 
          as: 'topicsFeeds',
          attributes: ['word'] 
        },
      ],
      raw: true, attributes: ['id', 'content', 'likeNum', 'commentNum', 'createdAt', 'updatedAt']})
      .catch(e => {console.log('get feeds error', e)});

    const userFeeds = [];
    for (let i = 0; i < temp.length; i += 1) {
      const { id, content, likeNum, commentNum, createdAt, updatedAt } = temp[i];
      const user = {userId: temp[i]['usersFeeds.id'], nickName: temp[i]['usersFeeds.nickName'], tag: temp[i]['usersFeeds.userIdTag.tagIdTag.id'] || null };

      const rst = {feedId: id, user, topic: temp[i]['topicsFeeds.word'], content, likeNum, commentNum, createdAt, updatedAt};
      userFeeds.push(rst);
    };
    res.status(200).json({data: {userFeeds}, message: 'ok'});
  },

  //? 피드 삭제 핸들러
  remove: async (req: Request, res:Response, next:NextFunction) => {
    const { authorization } = req.headers;
    const { feedId } = req.body;
    if (!authorization) {
      return res.status(401).json({message: 'unauthorized'});
    };
    if (!feedId) {
      return res.status(400).json({message: 'need accurate informaion'});
    };

    const accessToken = authorization.split(' ')[1];
    const accTokenSecret = process.env.ACCTOKEN_SECRET || 'acctest';
    jwt.verify(accessToken, accTokenSecret, async (err, decoded: any) => {
      if (err) {
        return res.status(401).json({message: 'invalid token'});
      };

      const userId = decoded.id;
      //? 모든 유효성 검사를 통과 후 삭제
      await Feeds.destroy({where: {id: feedId, userId}}).then(d => {
        if (d === 0) return res.status(404).json({message: 'feedId does not match with userId'});
        res.status(200).json({message: `feed ${feedId} was removed`});
      })
      .catch(e => {
        console.log('delete feed error');
      });
    });
  },

  //? 피드 에디트
  edit: async (req: Request, res:Response, next:NextFunction) => {
    const { authorization } = req.headers;
    const { content, feedId } = req.body;
    if (!authorization) {
      return res.status(401).json({message: 'unauthorized'});
    };

    if (!content || !feedId || content instanceof Array === false) {
      return res.status(400).json({message: 'need accurate informaion'});
    };

    const accessToken = authorization.split(' ')[1];
    const accTokenSecret = process.env.ACCTOKEN_SECRET || 'acctest';
    jwt.verify(accessToken, accTokenSecret, async (err, decoded: any) => {
      if (err) return res.status(401).json({message: 'invalid token'});
      const userId = decoded.id;
      //? 모든 유효성 검사 후 수정.
      await Feeds.update({content: JSON.stringify(content)}, {where: {userId, id: feedId}}).then(d => {
        if (d[0] === 0) return res.status(404).json({message: 'feedId does not match with userId'});
        res.status(200).json({message: `feed ${feedId} edited successfully`});
      }).catch(e => {
        console.log('edit feed error');
      });
    });
  }
}

export default feedHandler;