import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import Sequelize from 'sequelize';
import { Topics } from '../../models/topic';
dotenv.config();

//? 어드민 체크를 거친 후
const topicHandler = {
  //? 토픽 생성
  upload: async (req: Request, res:Response, next: NextFunction) => {
    let { word, expiration } = req.body;
    if (!word || !expiration) return res.status(400).json({message: 'need accurate information'});
    const isExist: boolean = await Topics.findOne({where: {word}}).then(d => d === null ? false : true);
    //? 이미 존재하는 단어일 때
    if (isExist) return res.status(400).json({message: 'word already exists'});
    if (expiration) {
      expiration = new Date(new Date(expiration).setHours(new Date(expiration).getHours() - 9));
      const isDupDate = await Topics.findOne({where: {expiration}}).then(d => d === null ? false : true);
      //? 이미 존재하는 만료 날짜일 때
      if (isDupDate) return res.status(400).json({message: 'expiration already exists'});
      //? 모든 유효성 검사 후 생성
      await Topics.create({word, expiration}).then(d => {
        return res.status(201).json({message: 'admin: topic uploaded'});
      });
    }
  },
  //? 모든 토픽 가져오기 어드민 전용
  bring: async (req: Request, res:Response, next: NextFunction) => {
    await Topics.findAll({
      attributes: ['id', 'word', 'expiration'],
      order: [['expiration', 'DESC']]
    }).then(d => {
      //? 토픽이 하나도 없을 때
      if (d.length === 0) return res.status(400).json({message: 'there are no topics'});
      //? 만료날 짜 순으로 정렬
      const topics = d.map(a => {
        a.expiration = new Date(new Date(a.expiration).setHours(new Date(a.expiration).getHours() + 9));
        return a;
      });
      res.status(200).send({data: {topics}, message: 'admin: all topics'});
    });
  },
  //? 토픽 수정
  edit: async (req: Request, res:Response, next: NextFunction) => {
    const Op = Sequelize.Op;
    const standardDate = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().substr(0, 10);
    
    const { word, topicId } = req.body;
    if (!word || !topicId) return res.status(400).json({message: 'need accurate information'});

    const isExist = await Topics.findOne({where: {word}}).then(d => d ? true : false);
    if (isExist) return res.status(400).json({message: 'word already exists'});
    //? 이미 만료되거나 지금 사용중인 단어일 때
    const isExpired = await Topics.findOne({where: {id: topicId, expiration: {[Op.lte]: standardDate}}}).then(d => d ? true: false);
    if (isExpired) return res.status(400).json({message: 'expired or current topic can not be editted'});
    //? 모든 유효성 검사 후 업데이트
    await Topics.update({word}, {where: {id: topicId}}).then(d => {
      if (d[0] ===0) return res.status(400).json({message: 'id does not exists'});
      else return res.status(200).json({message: 'admin: topic is editted successfully'});
    })
  }
};

export default topicHandler;