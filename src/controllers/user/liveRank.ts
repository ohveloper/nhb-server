import { Request, Response, NextFunction } from 'express';
import Sequelize from 'sequelize'
import { Feeds } from '../../models/feed';
import { Likes } from '../../models/like';
import { Tags } from '../../models/tag';
import { Users } from '../../models/user';
import { Users_tags } from '../../models/users_tag';

const liveRank = async (req: Request, res: Response, next: NextFunction) => {
  const Op = Sequelize.Op;
  const now = new Date()
  //? 15분전 시간 구하기
  const searchDate = new Date(now.setMinutes(now.getMinutes() - 15));
  //? 15 분 동안의 모든 Like 정보 수집
  const temp: any = await Likes.findAll({where: {createdAt: {[Op.gte]: searchDate}}, include: [
    {
      model: Feeds,
      as: 'feedsLikes',
      attributes: [[Sequelize.fn('COUNT', 'id'), 'likeCount']],
      include: [
        {
          model: Users,
          as: 'usersFeeds',
          attributes: ['id','nickName'],
        }
      ]
    }
  ], attributes: ['feedId'], group: ['feedId'],  order: [[Sequelize.literal("`feedsLikes.likeCount`"), 'DESC']]});

  //? 정보가 부족할 때 응답
  if (temp.length < 3) return res.status(400).json({message: 'not enough data'});

  //? 만약 정보가 있다면 아래처럼 정리하여 전송
  const rankTemp: any = {};
  for (let i = 0; i < temp.length; i += 1) {
    const userId: number = temp[i].feedsLikes.usersFeeds.id;
    const likeNum: number = Number(temp[i].feedsLikes.get().likeCount);
    if (!rankTemp[userId]) {
      rankTemp[userId] = likeNum;
    } else {
      rankTemp[userId] += likeNum;
    };
  };

  const rankArr = [];

  for (let key in rankTemp) {
    rankArr.push([key, rankTemp[key]]);
  };
  rankArr.sort((a, b) => b[1] - a[1]);
  
  const newRankArr = rankArr.slice(0, 3);
  if (newRankArr.length !== 3) return res.status(400).json({message: 'not enough data'});
  const userRank: any = await Users.findAll({where: {id: {[Op.or]: [newRankArr[0][0], newRankArr[1][0], newRankArr[2][0]]}}, include: [
    {
      model: Users_tags,
      as: 'userIdTag',
      attributes:['isUsed'],
      include: [
        {
          model: Tags,
          as: 'tagIdTag',
          attributes: ['id', 'tagName']
        }
      ]
    }
  ], attributes: ['id', 'nickName', 'avatarUrl']});

  const liveRank = []
  for (let i = 0; i < userRank.length; i += 1) {
    const { id, nickName, avatarUrl, userIdTag } = userRank[i];
    let tag = null;
    if (userIdTag) {
      for (let i = 0; i < userIdTag.length; i += 1) {
        if (userIdTag.isUsed === 1) {
          tag = userIdTag.tagIdTag.tagId;
          break;
        }
      }
    };
    const user = { userId: id, nickName, avatarUrl, tag, likeNum: rankTemp[id] };
    liveRank.push(user);
  };

  liveRank.sort((a, b) => b.likeNum - a.likeNum);

  res.status(200).json({ data: {liveRank}, message: 'ok' });
};

export default liveRank;