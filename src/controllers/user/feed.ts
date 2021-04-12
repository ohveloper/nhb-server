import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Sequelize, { where } from 'sequelize'
import dotenv from 'dotenv';
import { Users } from '../../models/user';
import { Users_tags } from '../../models/users_tag';
import { Tags } from '../../models/tag';
import { Topics } from '../../models/topic';
import { Likes } from '../../models/like';
import { Comments } from '../../models/comment';
import { Feeds } from '../../models/feed';
dotenv.config();

const bringPrivateFeeds = async (req: Request, res: Response, next: NextFunction) => {
  const Op = Sequelize.Op;
  const { authorization } = req.headers;
  const { limit, userId, feedId } = req.body;
  if (!authorization && !userId) return res.status(401).json({message: 'unauthorized'});
  if (!limit) return res.status(400).json({message: 'need accurate informaion'});

  const lastFeed = await Feeds.max('id'); //? 새로고침 밑의 null 자리에 넣고 변수 하나로 줄여도 됨
  const preFeed = feedId ? await Feeds.max('id', {where: {id: {[Op.lt]: feedId}}}).then(d => {
    if (!d) return -1;
    return d;
  }) : null; //? 계속탐색

  if (preFeed === - 1) return res.status(200).json({data: {userFeeds: []}, message: 'ok'});

  //? 시작점 기준으로 조회 limit으로 조회 범위 설정
  const feedsFunc: any = async (userId: number) => {
    return await Feeds.findAll({order: [['id', 'DESC']], limit, 
      where: {id: { [Op.lte]: preFeed || lastFeed}},
      include: [
        {
          model: Users, 
          as: 'usersFeeds',
          attributes: ['id', 'nickName'],
          where: {id: userId},
          include: [
            {
              model: Users_tags,
              as: 'userIdTag',
              attributes: ['isUsed'],
              include: [
                {
                  model: Tags,
                  as: 'tagIdTag',
                  attributes: ['tagName']
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
        {
          model: Likes,
          as: 'feedsLikes',
          attributes: ['id']
        },
        {
          model: Comments,
          as: 'commentsFeedId',
          attributes: ['id']
        }
      ],
    }).catch(e => {console.log('get feeds error')});
  };

  let feeds: any = [];

  //? userId가 있으면 토큰이 있어도 무시하게 하여 조회 가능하게 만들기
  //? 유저가 다른 유저를 찾아볼 때 사용
  if (authorization && !userId) {
    const accessToken = authorization.split(' ')[1];
    const accTokenSecret = process.env.ACCTOKEN_SECRET || 'acctest';
    await jwt.verify(accessToken, accTokenSecret, async (err, decoded: any) => {
      if (err) return res.status(401).json({message: 'invalid token'});
      feeds = await feedsFunc(decoded.id)
    })
  } else {
    feeds = await feedsFunc(userId);
  }

  if (!feeds) return res.status(200).json({message: 'feeds do not exists'});

  const privateFeeds: {}[] = [];
  for (let i = 0; i < feeds.length; i += 1) {
    interface Feed {
      feedId: number;
      user: {userId: number, nickName: string | number, tag: string | null};
      topic: string;
      content: string;
      likes: number;
      comments: number;
      createdAt: Date;
      updatedAt: Date;
    };
    const { id, 
      content, 
      createdAt, 
      updatedAt, 
      topicsFeeds, 
      usersFeeds, 
      feedsLikes, 
      commentsFeedId} = feeds[i].get();
    let tag = null;
    if (usersFeeds.userIdtag) {
      tag = usersFeeds.userIdTag.filter((a: Users_tags) => a.isUsed === 1)[0].tagIdTag.tagName;
    }
    const feed: Feed = {
      feedId: id,
      user: {userId: usersFeeds.id, nickName: usersFeeds.nickName, tag},
      topic: topicsFeeds.word,
      content: JSON.parse(content),
      likes: feedsLikes.length,
      comments: commentsFeedId.length,
      updatedAt,
      createdAt
    };
    privateFeeds.push(feed);
  };

  res.status(200).json({data: {privateFeeds}, message:'ok'});
}

export default bringPrivateFeeds;