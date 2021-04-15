import { Request, Response, NextFunction } from 'express';
import { Tags } from '../../models/tag';

const tag = async (req: Request, res: Response, next: NextFunction) => {
  const tags = await Tags.findAll({attributes: ['id', 'tagName', 'description', 'tagUrl'], raw: true});
  res.status(200).json({data: {tags}, message: 'All tags info'});
};

export default tag;