import { NextFunction, Request, Response } from 'express';
import Sequelize from 'sequelize';
import { Tags } from '../../models/tag';

const tagHandler = {
  upload: async (req: Request, res: Response, next: NextFunction) => {
    const { tagName, description } = req.body;
    if (!tagName || !description) return res.status(400).json({message: 'Need accurate informations'})

    await Tags.create({tagName, description}).then(d => {
      res.status(201).json({message: 'New tag is updated'});
    });
  },

  bring: async (req: Request, res: Response, next: NextFunction) => {
    await Tags.findAll({attributes: ['id', 'tagName', 'description']}).then(d => {
      res.status(200).json({data: {tags: d}, message: "All tags"});
    });
  },

  remove: async (req: Request, res: Response, next: NextFunction) => {
    const { tagId } = req.body;
    if (!tagId) return res.status(400).json({message: 'Need accurate informations'});

    await Tags.destroy({where: {id: tagId}}).then(d => {
      res.status(200).json({messgae: `Tag ${tagId} is removed`});
    });
  }
};

export default tagHandler;