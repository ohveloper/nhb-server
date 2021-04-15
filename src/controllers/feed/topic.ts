import { Request, Response, NextFunction } from 'express';
import { Topics } from '../../models/topic';
import Sequelize from 'sequelize';

//? 어드민이랑 같은 알고리즘
const topicBring = async (req: Request, res: Response, next: NextFunction) => {
  const Op = Sequelize.Op;
  const standardDate = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().substr(0, 10);

  await Topics.findAll({
    where: {expiration: {[Op.lte]: standardDate}},
    order: [['expiration', 'DESC']],
    attributes: ['id', 'word', 'expiration']
  }).then(d => {
    if (d.length === 0) return res.status(400).json({message: 'There are no topics'});
    const topics = d.map(a => {
      a.expiration = new Date(new Date(a.expiration).setHours(new Date(a.expiration).getHours() + 9));
      return a;
    });
    res.status(200).send({data: {topics}, message: 'Topics'});
  });
};

export default topicBring;