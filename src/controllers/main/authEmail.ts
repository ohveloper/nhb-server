import { Request, Response, NextFunction} from 'express';

const authEmail = (req:Request, res:Response, next:NextFunction) => {
  res.status(200).send('test controllers')
};

export default authEmail;